import React, { useContext, useState } from 'react';
import { priestLogin } from '../../Services/Apis';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './style.scss'
import { Loading } from '../Loader';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import ContextProvider from '../../Context/ContextProvider';

const Login = () => {
  const [Phone, setPhone] = useState('');
  const [Password, setPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const {setTokenExits} = useContext(ContextProvider);
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const res = await priestLogin({ Phone:'91'+Phone, Password });
    setLoading(false)
    if(res){
      Cookies.set("priestToken",res.token)
      setTokenExits(true)
      Navigate('/user');
      Swal.fire({
        position: "center",
        icon: "success",
        text: res.message,
        showConfirmButton: false,
        timer: 1100
      });
    }
  }

  return (
    <div className="login-container">
      {
        loading&&<Loading/>
      }
      <form onSubmit={handleSubmit} className="login-form">
        <div className='signup'>
          <h3>Login</h3>
          <input 
          className='int'
            placeholder='Enter Phone' 
            required 
            onChange={(e) => setPhone(e.target.value)} 
            type="tel" 
            name="Phone" 
            id="phone" 
          />
          <input 
          className='int'
            placeholder='Enter Password' 
            required 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            name="Password" 
            id="password" 
          />
          <button disabled={loading} type='submit'>Login</button>
        </div>
      </form>
      <Link to='/forget/pass' className="forgot-password">Forget Password</Link>
    </div>
  )
}

export default Login;