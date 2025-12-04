const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function run() {
    try {
        // 1. Register/Login User
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`Registering user: ${email}`);
        let response = await axios.post(`${API_URL}/auth/register`, {
            email,
            password,
            nome: 'Test User',
            telefone: '123456789',
            endereco: 'Test Address'
        });

        const token = response.data.token;
        const userId = response.data.user.id;
        console.log('User registered. Token obtained.');
        console.log('User ID:', userId);

        // 2. Create Hotel (as admin/user)
        console.log('Creating hotel...');
        response = await axios.post(`${API_URL}/hotels`, {
            nome: 'Test Hotel',
            localizacao: 'Test Location',
            descricao: 'Test Description',
            imagem: 'https://example.com/image.jpg',
            comodidades: ['Wifi'],
            tipos_quartos: [{
                nome: 'Standard',
                descricao: 'Standard Room',
                preco_por_noite: 100,
                capacidade_pessoas: 2,
                quantidade_disponivel: 10
            }]
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const hotel = response.data.hotel;
        console.log('Hotel created:', hotel._id);

        // Approve hotel (hack: update directly or assume auto-approve for test? 
        // The code sets approved: false. We need to approve it or the reservation will fail.)
        // Wait, the reservation code checks `if (!hotel.aprovado)`.
        // So we need to approve it.
        // We can use the admin route if we are admin, or we can just update the DB if we had access.
        // But we are using API.
        // Let's try to make the user admin? Or use an existing admin?
        // Or maybe we can just comment out the approval check for a second?
        // Or better, let's just try to fetch reservations. Maybe there are existing ones?

        // Actually, let's just try to fetch reservations for this new user. It should be 0.
        console.log('Fetching reservations (expect 0)...');
        response = await axios.get(`${API_URL}/reservations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Reservations count:', response.data.reservations.length);

        // If we can't easily create a reservation because of approval, 
        // let's try to login as an existing user who might have reservations?
        // But we don't know their credentials.

        // Let's try to create a reservation for a hotel that MIGHT exist?
        // No, that's flaky.

        // Let's try to approve the hotel using the admin route.
        // We need an admin token.
        // Is there a default admin?
        // Maybe we can skip the approval check in the backend for a moment to test?
        // Or we can just inspect the logs from this run to see if `req.userId` is printed correctly.

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

run();
