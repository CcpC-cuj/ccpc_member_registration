document.getElementById('btn1').addEventListener('click', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const phone = document.getElementById('mobile_number').value.trim();
    const PreferedLanguage = document.getElementById('language').value.trim();
    const Skills = document.getElementById('skills').value.trim();
    const reg_no = document.getElementById('reg').value.trim();
    const Batch = document.getElementById('Batch').value.trim();

    if (!name || !email || !password || !phone || !PreferedLanguage || !Skills || !reg_no || !Batch) {
        alert('All fields are required');
        return;
    }

    console.log('Sending Data:', { name, email, password, phone, PreferedLanguage, Skills, reg_no, Batch });

    try {
        const response = await fetch('https://ccpc-member-registration.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, phone, PreferedLanguage, Skills, reg_no, Batch })
        });

        const data = await response.json();
        console.log('Server Response:', data);

        if (response.ok) {
            alert(data.message);
            window.location.href = 'https://ccpc-cuj.web.app/';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Try again!');
    }
});
