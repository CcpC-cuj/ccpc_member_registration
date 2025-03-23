document.getElementById('btn1').addEventListener('click', async function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('mobile_number').value;
    const department = document.getElementById('password').value;  // Corrected field
    const reg_no = document.getElementById('reg').value;
    const Skills = document.getElementById('skills').value;
    const PreferedLanguage = document.getElementById('language').value;
    const Batch = document.getElementById('Batch').value;

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email');
        return;
    }
    if (Batch === "") {
        alert("Please select a Batch");
        return;
    }
    if (PreferedLanguage === "select") {
        alert("Please select a preferred language");
        return;
    }

    try {
        const response = await fetch('https://ccpc-member-registration.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, department, reg_no, Skills, PreferedLanguage, Batch })
        });

        const data = await response.json();
        if (data.ok) {
            alert(data.message);
            window.location.href = 'https://ccpc-cuj.web.app/';
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong. Try again!');
    }
});
