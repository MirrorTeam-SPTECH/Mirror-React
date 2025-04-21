// src/pages/SiteInstitucional.jsx  
import React from 'react';  
import HomePortalChurras from '../components/HomePortalChurras';  
import AboutUsSite from '../components/AboutUsSite';
import ChefsSite from '../components/ChefsSite';
import MenuSite from '../components/MenuSite';
import FooterSite from '../components/FooterSite';
import { Contact } from 'lucide-react';
import ContactSite from '../components/ContactSite';

const SiteInstitucional = () => {
    return (
      <div className="relative h-full w-full">

        <div className="absolute top-0 left-0 w-full h-full z-10">
          <HomePortalChurras />
        </div>

        <div className="absolute top-180 left-0 w-full h-full z-20">
          <AboutUsSite />
        </div>

        <div className="absolute top-350 left-0 w-full h-full z-10">
          <ChefsSite />
        </div>

        <div className="absolute top-480 left-0 w-full h-full z-20">
          <MenuSite />
        </div>

        <div className="absolute top-620 left-0 w-full h-full z-20">
          < ContactSite/>
        </div>

        <div className="absolute top-750 left-0 w-full h-full z-20">
          <FooterSite/>
        </div>
      </div>
    );
  };
  
  export default SiteInstitucional;