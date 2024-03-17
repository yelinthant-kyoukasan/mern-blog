import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from 'flowbite-react';
import {
    HiUser,
    HiArrowSmRight,
    HiDocumentText,
    HiOutlineUserGroup,
    HiAnnotation,
    HiChartPie,
  } from 'react-icons/hi';

function DashSidebar() {

    const location = useLocation();
    const [tab, setTab] = useState("")
  
    useEffect(() => {
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get('tab')
      
      if (tabFromUrl) {
        setTab(tabFromUrl)
      }
  
    }, [location.search])

  return (
    <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup>
                <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={"User"} labelColor="dark">
                    Profile
                </Sidebar.Item>
                <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSidebar