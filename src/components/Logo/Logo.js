import React from 'react';
import Tilty from 'react-tilty';
import brain from './brain.png';


const Logo = () => {
    return (
      <div className='ma4 mt0'>
        <Tilty  options={{ max:55 }} style={{ height:150, width: 150}}>
            <div className='tilt-inner'><img alt='logo' src={brain}/></div>
        </Tilty>
      </div>
    );
}

export default Logo;