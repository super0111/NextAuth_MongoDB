import React from 'react';
// import NYLP from '/assets/NY_LP.png';

export default function LicensePlate(props) {
    const {plate, width, height} = props;
    return (
        <div style={{height: height ? height : '80px', width: width ? width:'160px'}}>
            <div style={{ backgroundImage: `url(/assets/NY_LP.png)`, width:'100%', height:'100%',backgroundPosition: 'center',backgroundSize: 'cover',backgroundRepeat: 'no-repeat'}}>
                <div style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',paddingTop:'0.6rem'}}>
                     <span className="text-xl">{plate.toUpperCase()}</span>
                </div>
            </div>
        </div>
    )
}
