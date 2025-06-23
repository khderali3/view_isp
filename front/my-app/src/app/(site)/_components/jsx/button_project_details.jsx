
"use client"; // Add this line at the top of the file

import { useRouter } from 'next/navigation';

export const ProjectButton = ({ slug , text_button="" }) => {
  const router = useRouter();


  const handleMoreDetails = () => {
    if(slug) {
      router.push(`/project/${slug}`);
    } 

  }
  return (
    <button onClick={handleMoreDetails} className="btn btn-primary">
      {/* More Detailse */}
      {text_button}
    </button>
  );
};

 