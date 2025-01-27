import React from 'react'
import ProductCard from './Componests/UserPageComponet.jsx/BestSellerproduuct/Bestsellingproduct'
import HairProduct from './Componests/UserPageComponet.jsx/BestSellerproduuct/Hairproduct/Hairproduct'
import Footercontent from './Componests/UserPageComponet.jsx/Foooter/footerslide'
import FooterDetails from './Componests/UserPageComponet.jsx/Foooter/Foooterdesign'
import HeadTopHeading from './Componests/UserPageComponet.jsx/Navbarheadtop/swiperinword'
import UnifiedNavbar from './Componests/Navebar/Navbardesignhomepage'
import Bannerslider from './Componests/UserPageComponet.jsx/Bannerslicer'
import Homepageflowcontent from './Componests/UserPageComponet.jsx/Homepagecontent/Homepageflowcontent'

export default function Hometest() {
  return (
    <>
          <HeadTopHeading />
          <UnifiedNavbar />
     <Bannerslider />
          <Homepageflowcontent />
      <ProductCard/>
      <HairProduct/>
      <Footercontent/>

    <div className='bg-dark'>
    <FooterDetails />
    </div>
       
      
    </>
  )
}
