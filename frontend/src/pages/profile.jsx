import React from 'react';
import Navbar from '../components/navbar';
import { useUserContext } from '../../src/context/userContext';

const ProfilePage = () => {
  const { userData } = useUserContext();

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden relative" style={{
      backgroundColor: '#c1e4e7',
      backgroundImage: 'url("sky.jpg")',
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      height: "140vh",
    }}>
      <Navbar />

      {/* Box element */}
      <div
        className="flex items-center justify-center"
        style={{
          width: '90%',
          height: '80%',
          backgroundColor: '#16423C',
          opacity: 0.85,
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          borderRadius: '8px',
          display: 'flex',
        }}
      >
        {/* Left section */}
        <div
          style={{
            width: '30%',
            height: '100%',
            backgroundColor: '#16423C',
            borderRight: '4px solid #01201c',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: '8px',
            borderTopRightRadius: '0px',
            borderBottomRightRadius: '0px',
            position: 'relative',
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '60%',
              height: '30%',
              backgroundColor: '#01201c',
              backgroundImage: 'url("../src/assets/avatar.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '50%',
              marginTop: '20%',
            }}
          />

          <p className="text-lg mb-4 mt-8 font-Poppins"
            style={{
              fontSize: '1.5em',
              paddingTop: '1%',
              paddingBottom: '1%',
              color: '#b2dfdb'
            }}>
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-lg mb-4 font-Poppins"
            style={{
              fontSize: '1.5em',
              paddingBottom: '1%',
              color: '#b2dfdb'
            }}>
            Age: {userData.age}
          </p>
        </div>

        {/* Right section */}
        <div
          style={{
            width: '70%',
            height: '100%',
            backgroundColor: '#16423C',
            display: 'flex',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
        >
          <h2 className="font-CoolVetica" style={{ color: '#b2dfdb', fontSize: '4em', marginTop: '5%' }}>Your Profile</h2>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
