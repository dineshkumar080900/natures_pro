import React from 'react';
import Homepage from './Pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLogin from './Componests/Admin/adminlogin';
import Admin from './Pages/Admin';
import AddProduct from './Componests/Admin/Adminmaincompoments/Addproduct';
import BannerDesign from './Componests/Admin/Bannercontentadmin/BannerDesign';
import HeaderTitleContent from './Componests/Admin/Headertitle/Header';
import Couponcode from './Componests/Admin/Couponcode/Couponcode';
import Addproductlistpage from './Componests/Admin/Addproductlistpage';
import UserDetailsPage from './Componests/Admin/UserAdminpage/userDetails'; // Add the import for UserDetailsPage
import FileUpload from './FileUpload';
import Producttypeinelement from './Componests/Admin/producttype/producttype'
import MyWishlist from './Pages/MyWishlist';
import UserAccount from './Componests/UserPageComponet.jsx/UserAccount/Account';
import Productpage from './Pages/Productpage';
import Myprofile from './Componests/UserPageComponet.jsx/Account/Submenu/Myprofile';
import Protect from './Protect';
import Hometest from './Hometest';
import Producthomepage from './Pages/Producthomepage';
import ContainerOutsideExample from './Componests/UserPageComponet.jsx/Account/AccountNavbar';
import DeliveryAddress from './Componests/UserPageComponet.jsx/Account/Submenu/DeliveryAddress';
import Myorder from './Componests/UserPageComponet.jsx/Account/Submenu/Myorder';
import Chanegepassword from './Componests/UserPageComponet.jsx/Account/Submenu/changePassword';
import Addcart from './Componests/Adcart/Addcart';
import Nopage from './Pages/Nopage';
export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={
            <Protect>
              <Homepage />
            </Protect>
          } />

<Route path="/adminlogin" element={
            <Protect>
              <AdminLogin />
            </Protect>
          } />
          <Route path="/*" element={<Nopage />} />
          <Route path="/admindashboard" element={<Admin />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/Bannerdetails" element={<BannerDesign />} />
          <Route path="/HeaderTitleContent" element={<HeaderTitleContent />} />
          <Route path="/couponcode" element={<Couponcode />} />
          <Route path="/list-product" element={<Addproductlistpage />} />
          <Route path='/default' element={<FileUpload/>}/>
          <Route path="/User-details" element={<UserDetailsPage />} /> 
          <Route path="/productheadingtypeadd" element={<Producttypeinelement/>} /> 
          <Route path="/wishlist" element={<MyWishlist/>} /> 
          <Route path="/account" element={<Myprofile/>} /> 
          <Route path="/products/:id" element={<Productpage/>} /> 
          <Route path="/my_profile" element={<Myprofile/>} /> 
          <Route path="/sample" element={<Hometest/>} /> 
          <Route path="/products" element={<Producthomepage/>} /> 
          <Route path="/best-selling/products" element={<Producthomepage/>} /> 
          <Route path="/products/hairproduct" element={<Producthomepage/>} /> 
          <Route path="/shop" element={<Producthomepage/>} /> 
          <Route path="/my_profile" element={<Producthomepage/>} /> 
          <Route path="/delivery_address" element={<DeliveryAddress/>} /> 
          <Route path="/change_password" element={<Chanegepassword/>} /> 
          <Route path="/my_orders" element={<Myorder/>} /> 
          <Route path="/cart" element={<Addcart/>} /> 

       
       
        </Routes>
      </BrowserRouter>
    </div>
  );
}