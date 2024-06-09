import { getUserProfile } from '@/app/lib/dbActions';
import { userStore } from '@/reducers/store';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const UserProfile = () => {

  const user = userStore().user  

  const [formData, setFormData] = useState({
    nombre: user.name,
    email: user.email,
    telefono: user.phone,
    pais: user.country,
    password: "",
    repassword: ""
  });

  const isAdmin = user.admin;

  const handleInputChange = (event: any) => {
    // const { name, value } = event.target;
    // setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: any) => {
  //   event.preventDefault();
  //   // Lógica para enviar los cambios al backend
  //   console.log('Formulario enviado:', formData);
  };

  useEffect(() => {
    console.log(user);
    
    
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex flex-col items-start my-2'>
        <label htmlFor="nombre">Nombre: </label>
        <input
        className='my-2 py-2 px-4 rounded-lg border w-2/4'
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
        />
        <p className='text-sm'>Tu nombre de usuario aparecerá en el header de la página</p>
      </div>

      <div className='flex flex-col items-start my-4'>
        <label htmlFor="nombre">Correo: </label>
        <input
        className='my-2 py-2 px-4 rounded-lg border w-2/4'
          type="text"
          id="nombre"
          name="nombre"
          value={formData.email}
          onChange={handleInputChange}
        />
        <p className='text-sm'>Si cambias tu email deberas utilizar el nuevo email para iniciar sesión</p>
      </div>

      <div className='flex flex-col items-start my-4'>
        <label htmlFor="nombre">País: </label>
        <input
        className='my-2 py-2 px-4 rounded-lg border w-2/4'
          type="text"
          id="nombre"
          name="nombre"
          value={formData.pais}
          onChange={handleInputChange}
        />
        <p className='text-sm'></p>
      </div>

      <div className='flex flex-col items-start my-4'>
        <label htmlFor="nombre">Teléfono: </label>
        <input
        className='my-2 py-2 px-4 rounded-lg border w-2/4'
          type="text"
          id="nombre"
          name="nombre"
          value={formData.telefono}
          onChange={handleInputChange}
        />
        <p className='text-sm'></p>
      </div>

      <div className='flex flex-col items-start my-4'>
        <label htmlFor="nombre">Cambiar contraseña: </label>
        <p className='text-sm'>Contraseña actual:</p>
        <input
        className='my-2 py-2 px-4 rounded-lg border w-2/4'
          type="password"
          id="nombre"
          name="nombre"
          value={formData.password}
          onChange={handleInputChange}
        />
        

        <p className='text-sm'>Contraseña nueva</p>
        <input
        className='my-2 py-2 px-4 rounded-lg border w-2/4'
          type="password"
          id="nombre"
          name="nombre"
          value={formData.password}
          onChange={handleInputChange}
        />
        

        <p className='text-sm'>Verifica la contraseña nueva</p>
        <input
        className='my-2 py-2 px-4 rounded-lg border w-2/4'
          type="password"
          id="nombre"
          name="nombre"
          value={formData.password}
          onChange={handleInputChange}
        />
        
      </div>
      
      <button className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400' type="submit">Actualizar perfil</button>
    </form>
  );
};

export default UserProfile;
