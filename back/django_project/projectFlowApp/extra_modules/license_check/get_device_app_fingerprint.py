import hashlib
import socket
import subprocess
import re
import os
import json
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))  # this gets you to /mnt/disk2/.../django_project
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_project.settings')



from projectFlowApp.extra_modules.license_check.utils import get_or_create_installation_info
 

def get_cpu_serial():
    try:
        output = subprocess.check_output(['dmidecode', '-t', 'processor'], text=True, stderr=subprocess.DEVNULL)
        # output = subprocess.check_output(['sudo', 'dmidecode', '-s', 'system-uuid'], text=True, stderr=subprocess.DEVNULL)


        serial = None
        for line in output.splitlines():
            line = line.strip()
            if line.lower().startswith('id:'):
                serial = line.split(':', 1)[1].strip()
                break
        if serial:
            return serial
    except (subprocess.CalledProcessError, FileNotFoundError, PermissionError):
        pass

    try:
        with open('/proc/cpuinfo') as f:
            cpuinfo = f.read()
        match = re.search(r'flags\s*:.*', cpuinfo)
        if match:
            return hashlib.sha256(match.group().encode()).hexdigest()
    except Exception:
        pass

    return 'unknown-cpu-serial'

def get_first_nic_info():
    try:
        route_output = subprocess.check_output(['ip', 'route', 'show', 'default'], text=True).strip()
        default_nic = None
        if route_output:
            match = re.search(r'dev\s+(\S+)', route_output)
            if match:
                default_nic = match.group(1)

        ip_output = subprocess.check_output(['ip', '-o', 'addr', 'show'], text=True)
        interfaces = {}
        for line in ip_output.splitlines():
            parts = line.split()
            ifname = parts[1]
            family = parts[2]
            addr = parts[3].split('/')[0]
            if ifname == 'lo' or family not in ('inet', 'inet6'):
                continue
            interfaces.setdefault(ifname, {})[family] = addr

        def get_mac_addr(ifname):
            mac_path = f'/sys/class/net/{ifname}/address'
            if os.path.exists(mac_path):
                with open(mac_path) as f:
                    return f.read().strip()
            return '00:00:00:00:00:00'

        if default_nic and default_nic in interfaces:
            mac = get_mac_addr(default_nic)
            ip = interfaces[default_nic].get('inet', '0.0.0.0')
            return default_nic, mac, ip

        for ifname in interfaces:
            mac = get_mac_addr(ifname)
            ip = interfaces[ifname].get('inet', '0.0.0.0')
            return ifname, mac, ip

    except Exception:
        pass

    return 'unknown-nic', '00:00:00:00:00:00', '0.0.0.0'

def get_partition_uuid():
    try:
        lsblk_output = subprocess.check_output(['lsblk', '-J', '-o', 'NAME,TYPE,UUID'], text=True)
        data = json.loads(lsblk_output)

        def find_first_partition(blocks):
            for block in blocks:
                if block['type'] == 'part' and block.get('uuid'):
                    return block['uuid']
                if block['type'] == 'disk' and 'children' in block:
                    uuid = find_first_partition(block['children'])
                    if uuid:
                        return uuid
            return None

        uuid = find_first_partition(data['blockdevices'])
        if uuid:
            return uuid
    except Exception:
        pass

    return 'unknown-uuid'

def get_hostname():
    try:
        return socket.gethostname()
    except Exception:
        return 'unknown-hostname'

# ----------------- NEW FUNCTIONS -------------------

 

def detect_environment_type():
    """
    Detects whether the system is a VM, container, or bare metal.
    Uses systemd-detect-virt, dmidecode, and /proc/1/cgroup.
    """
    try:
        output = subprocess.check_output(['systemd-detect-virt'], text=True, stderr=subprocess.DEVNULL).strip()
        if output == "none":
            pass  # May still be container
        elif output in ("docker", "lxc"):
            return f"container ({output})"
        else:
            return f"virtual_machine ({output})"
    except Exception:
        pass

    # Fallback: Check for container in /proc/1/cgroup
    try:
        with open("/proc/1/cgroup") as f:
            content = f.read()
            if "docker" in content:
                return "container (docker)"
            elif "lxc" in content:
                return "container (lxc)"
    except Exception:
        pass

    # Fallback: Check system manufacturer (e.g., VMware, QEMU)
    try:
        manu = subprocess.check_output(['dmidecode', '-s', 'system-manufacturer'], text=True, stderr=subprocess.DEVNULL).strip().lower()
        known_vm = ['vmware', 'qemu', 'microsoft', 'innotek', 'xen', 'parallels']
        for vm in known_vm:
            if vm in manu:
                return f"virtual_machine ({manu})"
    except Exception:
        pass

    return "bare_metal"

# ----------------- MAIN ID GENERATION -------------------

def generate_device_app_fingerprint():
    cpu_serial = get_cpu_serial()
    nic_name, mac, ip = get_first_nic_info()
    partition_uuid = get_partition_uuid()
    hostname = get_hostname()
    environment_type = detect_environment_type()
    app_info = get_or_create_installation_info('projectFlowApp')
    app_installation_id = app_info.get('installation_id')
    app_name_id = app_info.get('app_name')
    current_file_path = os.path.abspath(__file__)

    raw_string = f'{cpu_serial}|{nic_name}|{mac}|{ip}|{partition_uuid}|{hostname}|{app_installation_id}|{app_name_id}|{environment_type}|{current_file_path}'
    device_app_fingerprint = hashlib.sha256(raw_string.encode('utf-8')).hexdigest()

    return {
        'cpu_serial': cpu_serial,
        'nic_name': nic_name,
        'mac_address': mac,
        'ip_address': ip,
        'partition_uuid': partition_uuid,
        'hostname': hostname,
        "app_installation_id" : app_installation_id,
        "app_name_id" : app_name_id,  
        'environment_type': environment_type,
        'device_app_fingerprint': device_app_fingerprint,
      
    }

 
 
# info = generate_machine_id()
# print("Collected Machine Info:" , info)
if __name__ == '__main__':
    info = generate_device_app_fingerprint()
    print("Collected Machine Info:", info)
