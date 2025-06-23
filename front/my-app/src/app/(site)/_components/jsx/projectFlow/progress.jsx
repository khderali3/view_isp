"use client"



import { useState, useEffect } from "react"



export const ProgressCircleDetailsInfo = ({targetPercentage=0, animation_speed=25}) => {

    // const targetPercentage = 85; // Target percentage
    const [percentage, setPercentage] = useState(0);
  
    useEffect(() => {



    if (targetPercentage === 0) { 
        setPercentage(0); // Ensure it stays at 0
        return;
        }
    
    

      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setPercentage(current);
        if (current >= targetPercentage) clearInterval(interval);
      }, animation_speed); // Speed of animation
  
      return () => clearInterval(interval);
    }, [targetPercentage]);




    return (

 
        <div className="d-flex justify-content-start   align-items-center" style={{ position: 'relative' }}>
        <div className="progress-circle" style={{ position: 'relative' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background Circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              style={{
                fill: 'none',
                stroke: '#e0e0e0',
                strokeWidth: 8
              }} 
            />
            
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              style={{
                fill: 'none',
                stroke: '#58b3c8',
                strokeWidth: 8,
                strokeLinecap: 'round',
                strokeDasharray: 251,
                strokeDashoffset: `calc(251 - (251 * ${percentage}) / 100)`,
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
            
            {/* Filled Circle (Color) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              style={{
                fill: 'rgba(132, 224, 152, 0.3)', // Blue color with transparency
                stroke: 'none',
                strokeDasharray: 251,
                strokeDashoffset: `calc(251 - (251 * ${percentage}) / 100)`,
              }}
            />
          </svg>
  
          {/* Percentage Text */}
          <span 
            className="position-absolute fw-bold" 
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,  // Ensures the text is on top of the circle
            }}
          >
            {percentage}%
          </span>
        </div>
      </div>




    )
}







export const ProgressCircle = ({targetPercentage=0, animation_speed=25}) => {

    // const targetPercentage = 85; // Target percentage
    const [percentage, setPercentage] = useState(0);
  
    useEffect(() => {
    if (targetPercentage === 0) { 
        setPercentage(0); // Ensure it stays at 0
        return;
        }



      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setPercentage(current);
        if (current >= targetPercentage) clearInterval(interval);
      }, animation_speed); // Speed of animation
  
      return () => clearInterval(interval);
    }, [targetPercentage]);




    // return (
    //     <div className="d-flex justify-content-start justify-content-md-end align-items-end" style={{ position: 'relative' }}>
    //         <div className="progress-circle" style={{ position: 'relative' }}>
    //         <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
    //             {/* Background Circle */}
    //             <circle 
    //             cx="40" 
    //             cy="40" 
    //             r="30" 
    //             style={{
    //                 fill: 'none',
    //                 stroke: '#e0e0e0',
    //                 strokeWidth: 6
    //             }} 
    //             />
                
    //             {/* Progress Circle */}
    //             <circle
    //             cx="40"
    //             cy="40"
    //             r="30"
    //             style={{
    //                 fill: 'none',
    //                 stroke: '#58b3c8',
    //                 strokeWidth: 6,
    //                 strokeLinecap: 'round',
    //                 strokeDasharray: 188, // Adjusted for r=30
    //                 strokeDashoffset: `calc(188 - (188 * ${percentage}) / 100)`,
    //                 transition: 'stroke-dashoffset 0.5s ease',
    //             }}
    //             />
                
    //             {/* Filled Circle (Color) */}
    //             <circle
    //             cx="40"
    //             cy="40"
    //             r="30"
    //             style={{
    //                 fill: 'rgba(218, 219, 224, 0.3)', // Blue color with transparency
    //                 stroke: 'none',
    //             }}
    //             />
    //         </svg>

    //         {/* Percentage Text */}
    //         <span 
    //             className="position-absolute fw-bold" 
    //             style={{
    //             fontSize: '1rem',
    //             fontWeight: 'bold',
    //             top: '50%',
    //             left: '50%',
    //             transform: 'translate(-50%, -50%)',
    //             zIndex: 1,  // Ensures the text is on top of the circle
    //             }}
    //         >
    //             {percentage}%
    //         </span>
    //         </div>
    //   </div>
    // )


    return(


<div className="d-flex justify-content-start justify-content-md-end align-items-end" style={{ position: 'relative' }}>
    <div className="progress-circle" style={{ position: 'relative', width: '80px', height: '80px' }}>
        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
            {/* Filled Background Circle - Moved Before Progress */}
            <circle
                cx="40"
                cy="40"
                r="30"
                style={{
                    fill: 'rgba(218, 219, 224, 0.3)', 
                    stroke: 'none',
                }}
            />

            {/* Background Stroke Circle */}
            <circle 
                cx="40" 
                cy="40" 
                r="30" 
                style={{
                    fill: 'none',
                    stroke: '#e0e0e0',
                    strokeWidth: 6
                }} 
            />
            
            {/* Progress Circle */}
            <circle
                cx="40"
                cy="40"
                r="30"
                style={{
                    fill: 'none',
                    stroke: '#58b3c8',
                    strokeWidth: 6,
                    strokeLinecap: 'round',
                    strokeDasharray: 188, 
                    strokeDashoffset: `calc(188 - (188 * ${percentage}) / 100)`,
                    transition: 'stroke-dashoffset 0.5s ease',
                }}
            />
        </svg>

        {/* Percentage Text - Ensuring Center Position */}
        <span 
            className="position-absolute fw-bold" 
            style={{
                fontSize: '1rem',
                fontWeight: 'bold',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
                whiteSpace: 'nowrap'  // Prevents text shifting due to wrapping
            }}
        >
            {percentage}%
        </span>
    </div>
</div>




    )



}