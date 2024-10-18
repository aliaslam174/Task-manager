import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  return (
    <div className='mt-8 content-center w-full mb-10'>
        <div className='w-[80vw] md:w-[40vw]  flex flex-col content-center m-auto'>
          <h2 className='font-semibold text-4xl text-center mb-4'>Sign in</h2>
          <p className='text-[#64748B] text-center'>
            Don’t have an account yet?{' '}
            <Link to="/signup" className='underline'>
              Register here
            </Link>
          </p>
          

          {/* Form */}
          <form onSubmit={""}>
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

            <div className='mt-6'>
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
                type='submit'
                className='border-solid w-full border pt-[12px] pb-[12px] ps-[16px] pe-[16px] rounded-[8px] mt-3 mb-3 font-normal text-[14px] bg-[#23272E] text-[#fff]'
              >
                Sign in
              </button>
            </div>

            
          </form>
        </div>
      </div>
  )
}

export default Login