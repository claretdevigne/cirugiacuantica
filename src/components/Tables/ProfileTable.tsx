import { useState } from 'react';

const UserProfile = ({ user } : any) => {
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    email: user.email,
    telefono: user.telefono,
    pais: user.pais,
    password: '', // Campo de contraseña solo para usuarios no admin
  });

  const isAdmin = user.admin;

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Lógica para enviar los cambios al backend
    console.log('Formulario enviado:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nombre">Nombre:</label>
      <input
        type="text"
        id="nombre"
        name="nombre"
        value={formData.nombre}
        onChange={handleInputChange}
        disabled={isAdmin} // Deshabilita el campo si el usuario es admin
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        disabled={isAdmin}
      />

      {!isAdmin && ( // Mostrar campos adicionales solo para usuarios no admin
        <>
          <label htmlFor="telefono">Teléfono:</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleInputChange}
          />

          <label htmlFor="pais">País:</label>
          <input
            type="text"
            id="pais"
            name="pais"
            value={formData.pais}
            onChange={handleInputChange}
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </>
      )}

      <button type="submit">Guardar cambios</button>
    </form>
  );
};

export default UserProfile;
