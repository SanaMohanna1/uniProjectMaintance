import React from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';

import SingleBanner from '../../components/Banners/SingleBanner'
import UserSidebar from '../../components/UserProfile/UserSidebar'
import AccountSettings from '../../components/UserProfile/AccountSettings'
import './UserProfile.css'
import ChangePassword from '../../components/UserProfile/ChangePassword'
import YourOrders from '../../components/UserProfile/YourOrders'
import UserAddress from '../../components/UserProfile/UserAddress'

const UserProfile = () => {

    const {activepage} = useParams()


    // alert(activepage)
  return (
    <div className='userprofile'>
        <SingleBanner 
        heading={`My Profile`}
        bannerimage = 'https://img.freepik.com/premium-vector/daisies-petals-pink-background-seamless-pattern-chamomile-flowers_345837-850.jpg' 
        />
        {/* UserProfile , showing {activepage}
         */}

         <div className='userprofilein'>
            <div className='left'>
              <UserSidebar activepage={activepage}/>
            </div>
            <div className='right'>
              {activepage === 'accountsettings' && <AccountSettings/>}
              {activepage === 'changepassword' && <ChangePassword/>}
              {activepage === 'yourorders' && <YourOrders/>}
              {activepage === 'address' && <UserAddress/>}
            </div>
         </div>
        </div>
  )

}

export default UserProfile