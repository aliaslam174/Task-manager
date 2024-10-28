import { notification } from 'antd';
import axios from 'axios';
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');
const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();




    // axios.post('/user', {
    //   firstName: 'Fred',
    //   lastName: 'Flintstone'
    // })
    // .then(function (response) {
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   console.log(error);
    // });

    await axios.post('https://task-manager.codionslab.com/api/v1/register', {
      name,
      password,
      email
    }).then((response) => {
      console.log(response.data);
      
if(response.data.status === 200){
  
  notification.success({
    message: response.data.message,
    description: 'You have successfully registered!',
    placement: 'topRight',
    duration: 3,
  });
   // Reset form fields
   navigate('/dashbord');
   setUsername('');
   setPassword('');

   // Redirect to login page

}
         // Show success notification
    

    // Redirect after successful registration
    }).catch((error) => {
      console.log(error.response.data.message);
      setError(error.response.data.message)
    });

   



  };
  return (
    <>

      <div className='mt-20 content-center w-full mb-10'>
        <div className='w-[80vw] md:w-[40vw]  flex flex-col content-center m-auto'>
          <h2 className='font-semibold lg:text-4xl  text-xl text-center mb-4'>Create new account</h2>
          <p className='text-[#64748B] text-center'>
            Already have an account?{' '}
            <Link to='/login' className='underline'>
              Sign in
            </Link>
          </p>


          {/* Form */}
          <form >
            <div className='mt-10'>
              <div>
                <label htmlFor='name' className='uppercase text-[#526077]'>
                  Name
                </label>

              </div>
              <div className='m-auto text-center'>
                <input
                  type='text'
                  id='email'
                  className='w-full pt-[12px] pb-[12px] ps-[16px] pe-[16px] rounded-[8px] border'
                  placeholder='ENTER YOUR Name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

            </div>
            <div className='mt-10'>
              <div>
                <label htmlFor='email' className='uppercase text-[#526077]'>
                  email
                </label>

              </div>
              <div className='m-auto text-center'>
                <input
                  type='email'
                  id='email'
                  className='w-full pt-[12px] pb-[12px] ps-[16px] pe-[16px] rounded-[8px] border'
                  placeholder='ENTER YOUR EMAIL'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

            </div>


            <div className='my-10'>
              <div>
                <label htmlFor='password' className='uppercase text-[#526077]'>
                  password
                </label>
              </div>
              <input
                type='password'
                id='password'

                className='w-full pt-[12px] pb-[12px] ps-[16px] pe-[16px] rounded-[8px] border'
                placeholder='PASSWORD'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>



            {error && <div className='text-red-500 mt-2'>{error}</div>}

            <div>
              <button
                onClick={handleSubmit}
                type='submit'
                className='border-solid w-full border pt-[12px] pb-[12px] ps-[16px] pe-[16px] rounded-[8px] mt-3 mb-3 font-normal text-[14px] bg-[#23272E] text-[#fff]'
              >
                Register
              </button>
            </div>


          </form>
        </div>
      </div>

    </>
  )
}

export default Signup