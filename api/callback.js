const axios = require('axios');

export default async function handler(req, res) {
    const { code } = req.query;
    const config = {
        clientId: '1493672986119634944',
        clientSecret: 'XS-rnpJen-gLBzWJpHsHCgek5c84tfsC',
        botToken: 'MTQ5MjIyMzQ1MjMxOTQ1MzI3Nw.GoHU2s.LLs1dJMWb9RmQ4i5QnCb_kXnlWYbhxRQ5N4vX8', // Nhớ thay Token thật của bạn vào đây nhen!
        guildId: '1354238193611964447',
        roleId: '1494450199618130062'
    };

    if (!code) return res.status(400).send('Xác thực thất bại!');

    try {
        const tokenRes = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: `https://${req.headers.host}/callback`,
        }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

        const userRes = await axios.get('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenRes.data.access_token}` }
        });

        await axios.put(
            `https://discord.com/api/guilds/${config.guildId}/members/${userRes.data.id}/roles/${config.roleId}`,
            {}, { headers: { Authorization: `Bot ${config.botToken}` } }
        );

        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <body style="background:#0d0f17;color:white;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;margin:0;">
                <div style="text-align:center;border:1px solid #5865f2;padding:50px;border-radius:28px;box-shadow:0 0 40px rgba(88,101,242,0.3);background:#161923;">
                    <div style="background:#43b581;width:80px;height:80px;border-radius:20px;display:flex;justify-content:center;align-items:center;margin:0 auto 20px auto;font-size:40px;">✅</div>
                    <h1 style="margin-bottom:10px;">XÁC THỰC THÀNH CÔNG</h1>
                    <p style="color:#b9bbbe;">Chào <b>${userRes.data.username}</b>, bạn đã nhận được Role nhen!</p>
                </div>
            </body>
        `);
    } catch (e) { 
        res.status(500).send('Lỗi rồi Justin ơi! Check lại Token hoặc Client Secret nhen.'); 
    }
}
