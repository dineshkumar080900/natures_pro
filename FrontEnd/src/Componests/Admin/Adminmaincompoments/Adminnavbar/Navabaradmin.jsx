import React from 'react'
import './Navbar.css'
import navlogo from '../../../../assets/Image/Lkm1_1_47aec8f4-69ca-4d80-be5f-b941bc1bf140_155x@2x.webp';
export default function Navabaradmin() {
  const value=44;
  const css={
    height:value+'px',
    width:value+'px',
    borderRadius:value+'px',
    marginRight:value-30+'px'
  }
  return (
    <div className='navbar'>
      <div className='navbar-left'>
        <img src={navlogo} alt="" className='nav-logo'/>
      </div>
      {/* <div className='navbar-right'>
        <img src={profile} alt='' className='nav-profile' style={css}/>
        <i className='fa fa-chevron-down'></i>
      </div> */}
    </div>
  )
}
