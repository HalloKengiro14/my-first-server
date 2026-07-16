// 1. เรียกใชงาน Module ที่ชื่อวา 'http' ซึ่งเปนระบบพื้นฐานของ Node.js สําหรับทําเซิรฟเวอร
const http = require('http');

// 2. กําหนดชองทาง (Port) ที่เซิรฟเวอรจะใชสื่อสาร โดยใหใชของที่ Cloud กําหนด
const port = process.env.PORT || 3000;

// 3. สรางเครื่องแมขาย (Server) ที่คอยรับคําขอ (req) และตอบกลับ (res)
const server = http.createServer((req, res) => {

// 3.1 ตั้งรหัสสถานะ 200 หมายถึง "ทํางานสําเร็จ (OK)"
res.statusCode = 200;

// 3.2 บอกเบราวเซอรของผูใชวา สิ่งที่สงกลับไปคือไฟลขอความแบบ HTML แลดวยภาษาไทย
res.setHeader('Content-Type', 'text/html; charset=utf-8');

// 3.3 สงขอมูลหนาเว็บกลับไปหาผูใช (ปรับแก้ไข UI ให้สวยงาม)
res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Server</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
            max-width: 600px;
            animation: slideIn 0.5s ease-in-out;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .subtitle {
            color: #764ba2;
            font-size: 1.2em;
            margin-bottom: 30px;
            font-weight: 500;
        }
        
        .info-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            font-size: 1.1em;
        }
        
        .status {
            display: inline-block;
            background: #4CAF50;
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            margin-top: 20px;
            font-weight: 600;
            font-size: 1em;
        }
        
        .decoration {
            margin-top: 40px;
            font-size: 2em;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎉 สวัสดีครับ!</h1>
        <div class="subtitle">Web Server กำลังทำงาน</div>
        
        <div class="info-box">
            <strong>นายรพีพัทธ์ เจริญรัญวุฒิกุล</strong>
        </div>
        
        <div class="info-box">
            <strong>รหัสนักศึกษา:</strong> [ใส่รหัสของคุณ]
        </div>
        
        <div class="status">✓ ระบบกำลังทำงาน</div>
        
        <div class="decoration">
            🚀 💻 ⚙️
        </div>
    </div>
</body>
</html>
`);
});

// 4. สั่งใหเซิรฟเวอรเริ่มตนเปดรับฟงการเชื่อมตอตาม Port ที่กําหนดไว
server.listen(port, () => {
console.log(`Server is running! เครื่องแม่ข่ายเปิดทํางานแล้วที่ช่องทาง: ${port}`);
});
