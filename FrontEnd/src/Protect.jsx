import React from 'react'

function Protect({children}) {
    console.log(localStorage);
    
        return (
            <div>
              {children}
            </div>
          )
    
  
}

export default Protect
