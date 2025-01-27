import React from 'react'
import HeadTopHeading from '../Componests/UserPageComponet.jsx/Navbarheadtop/swiperinword'
import UnifiedNavbar from '../Componests/Navebar/Navbardesignhomepage'
import Homepageflowcontent from '../Componests/UserPageComponet.jsx/Homepagecontent/Homepageflowcontent'
import ProductCard from '../Componests/UserPageComponet.jsx/BestSellerproduuct/Bestsellingproduct'
import HairProduct from '../Componests/UserPageComponet.jsx/BestSellerproduuct/Hairproduct/Hairproduct'
import Footercontent from '../Componests/UserPageComponet.jsx/Foooter/footerslide'
import FooterDetails from '../Componests/UserPageComponet.jsx/Foooter/Foooterdesign'
import Bannerslider from '../Componests/UserPageComponet.jsx/Bannerslicer'

export default function Homepage() {
  return (
    <>
     <HeadTopHeading />
          <UnifiedNavbar />
  <Bannerslider />
        <Homepageflowcontent />
      <ProductCard/>
      <HairProduct/>
      <Footercontent/>
      <div style={{backgroundColor:"#a4b660"}}>
      <FooterDetails /> 
      </div>
        
    
    </>
  )
}
