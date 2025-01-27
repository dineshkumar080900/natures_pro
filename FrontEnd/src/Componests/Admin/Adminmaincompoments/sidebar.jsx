import React from 'react'
import './Sidebar.css';
import { Link } from 'react-router-dom';
export default function Sidebar() {
    const linkCss={
       
    }
  return (

    <div className='sidebar' style={{height:"100vh"}}>
        <Link to='/add-product' id='linkCss' >
            <div className="sidebar-item">
                <p className='mt-3'>Add Product</p>
            </div>
        </Link>
        <Link to='/productheadingtypeadd' id='linkCss'>
            <div className="sidebar-item">
                {/* <i className='fa fa-list'></i> */}
                <p className='mt-3'>ProductType</p>
            </div>
        </Link>
        <Link to='/list-product' id='linkCss'>
            <div className="sidebar-item">
                {/* <i className='fa fa-list'></i> */}
                <p className='mt-3'>Product List</p>
            </div>
        </Link>
        {/* <Link to='/User-details' id='linkCss'>
            <div className="sidebar-item">
                <p className='mt-3'>User Details</p>
            </div>
        </Link> */}
        <Link to='/Bannerdetails' id='linkCss'>
            <div className="sidebar-item">
                {/* <i className='fa fa-list'></i> */}
                <p className='mt-3'>Banner Details</p>
            </div>
        </Link>
        <Link to='/HeaderTitleContent' id='linkCss'>
            <div className="sidebar-item">
                {/* <i className='fa fa-list'></i> */}
                <p className='mt-3'>Header Title Content</p>
            </div>
        </Link>
     
        <Link to='/couponcode' id='linkCss'>
            <div className="sidebar-item">
                {/* <i className='fa fa-list'></i> */}
                <p className='mt-3'>Coupon Code</p>
            </div>
        </Link>
       
        <Link to='/couponcode' id='linkCss'>
              
        </Link>
    </div>
  )
}
