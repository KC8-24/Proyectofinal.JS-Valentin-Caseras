document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let username = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    // Validar que los campos no estén vacíos
    if (!username || !email || !password) {
        showMessage('Todos los campos son obligatorios', 'error');
        return;
    }

    // Crear un objeto de usuario
    let user = {
        username: username,
        email: email,
        password: password
    };

        // Mostrar los datos en la consola
        console.log('Usuario registrado:', user);

    // Obtener los usuarios almacenados en localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Agregar el nuevo usuario
    users.push(user);

    // Guardar los usuarios actualizados en localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Limpiar el formulario
    document.getElementById('registerForm').reset();

    showMessage('Usuario registrado exitosamente', 'success');
});

function showMessage(message, type) {
    let messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    messageDiv.style.color = type === 'success' ? 'green' : 'red';

    setTimeout(() => {
        messageDiv.innerText = '';
    }, 3000);
}