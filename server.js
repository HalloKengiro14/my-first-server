// 1. เรียกใชงาน Module ที่ชื่อวา 'http' ซึ่งเปนระบบพื้นฐานของ Node.js สำหรับทำเซิร์ฟเวอร์
const http = require('http');

// 1.1 เรียกใช้งาน Pool จากไลบรารี pg สำหรับจัดการการเชื่อมต่อฐานข้อมูล
const { Pool } = require('pg');

// 2. กำหนดช่องทาง (Port) ที่เซิร์ฟเวอร์จะใช้สื่อสาร โดยให้ใช้ของที่ Cloud กำหนด
const port = process.env.PORT || 3000;

// 2.1 ตั้งค่าการเชื่อมต่อ โดยดึง URL มาจาก Environment Variable ของ Railway
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 3. สร้างเครื่องแม่ขาย (Server) ที่คอยรับคำขอ (req) และตอบกลับ (res)
const server = http.createServer(async (req, res) => {

// 3.1 ตั้งรหัสสถานะ 200 หมายถึง "ทำงานสำเร็จ (OK)"
res.statusCode = 200;

// 3.2 บอกเบราวเซอร์ของผู้ใช้ว่า สิ่งที่ส่งกลับไปคือไฟล์ข้อความแบบ HTML และด้วยภาษาไทย
res.setHeader('Content-Type', 'text/html; charset=utf-8');

try {
  // 3.3 ขอเชื่อมต่อและส่งคำสั่ง SQL ไปดึงข้อมูลจากตาราง students
  const client = await pool.connect();
  const result = await client.query('SELECT * FROM students ORDER BY student_id');
  client.release(); // คืนการเชื่อมต่อเมื่อใช้งานเสร็จ

  // 3.4 นำข้อมูลที่ได้ (result.rows) มาประกอบเป็นตาราง HTML ภายใน UI ที่สวยงาม
  let studentTableHTML = '';
  
  if (result.rows && result.rows.length > 0) {
    result.rows.forEach((row, index) => {
      studentTableHTML += `
        <tr>
          <td class="table-cell">${row.student_id || '-'}</td>
          <td class="table-cell">${row.student_name || '-'}</td>
          <td class="table-cell">${row.email || '-'}</td>
        </tr>
      `;
    });
  } else {
    studentTableHTML = `
      <tr>
        <td colspan="3" class="table-cell" style="text-align: center; color: #999;">ไม่พบข้อมูลนักศึกษา</td>
      </tr>
    `;
  }

  // 3.5 ส่งข้อมูลหน้าเว็บกลับไปหาผู้ใช้
  res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Server</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700;800&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: auto;
            position: relative;
            padding: 20px;
        }

        /* Animated background elements */
        .bg-animation {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: -1;
            overflow: hidden;
        }

        .floating-shape {
            position: absolute;
            opacity: 0.05;
            animation: float 20s infinite ease-in-out;
        }

        .shape1 {
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, #e94560, transparent);
            border-radius: 50%;
            top: -100px;
            left: -100px;
            animation-delay: 0s;
        }

        .shape2 {
            width: 250px;
            height: 250px;
            background: radial-gradient(circle, #00d4ff, transparent);
            border-radius: 50%;
            bottom: -50px;
            right: -50px;
            animation-delay: 3s;
        }

        .shape3 {
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, #ffd700, transparent);
            border-radius: 50%;
            top: 50%;
            right: 5%;
            animation-delay: 6s;
        }

        @keyframes float {
            0%, 100% { transform: translate(0, 0); }
            25% { transform: translate(30px, -30px); }
            50% { transform: translate(0, -60px); }
            75% { transform: translate(-30px, -30px); }
        }

        .container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 30px;
            padding: 50px;
            box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5), 0 0 80px rgba(233, 69, 96, 0.3);
            text-align: center;
            max-width: 1000px;
            position: relative;
            border: 2px solid rgba(233, 69, 96, 0.1);
            animation: slideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }

        .header {
            margin-bottom: 30px;
        }

        .emoji-animation {
            font-size: 4em;
            display: inline-block;
            animation: bounce 1s ease-in-out infinite;
            margin-right: 15px;
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }

        h1 {
            color: #1a1a2e;
            font-size: 3.5em;
            margin: 20px 0;
            font-weight: 800;
            background: linear-gradient(135deg, #e94560, #00d4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -1px;
        }

        h2 {
            color: #16213e;
            font-size: 1.8em;
            margin: 30px 0 20px 0;
            font-weight: 700;
            text-align: left;
            border-bottom: 3px solid #e94560;
            padding-bottom: 10px;
        }

        .subtitle {
            color: #16213e;
            font-size: 1.3em;
            margin-bottom: 40px;
            font-weight: 300;
            letter-spacing: 2px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 40px 0;
        }

        .info-card {
            background: linear-gradient(135deg, #e94560 0%, #ff6b9d 100%);
            color: white;
            padding: 25px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
            transition: all 0.3s ease;
            transform: translateY(0);
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.2);
            transition: left 0.5s ease;
            z-index: -1;
        }

        .info-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(233, 69, 96, 0.4);
        }

        .info-card:hover::before {
            left: 100%;
        }

        .info-card-label {
            font-size: 0.9em;
            opacity: 0.9;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }

        .info-card-value {
            font-size: 1.4em;
            font-weight: 700;
            word-break: break-word;
        }

        .status-badge {
            display: inline-block;
            background: linear-gradient(135deg, #00d4ff, #0099ff);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            margin-top: 30px;
            margin-bottom: 40px;
            font-weight: 600;
            font-size: 1.1em;
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
            animation: pulse 2s ease-in-out infinite;
            border: 2px solid rgba(0, 212, 255, 0.5);
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 15px 40px rgba(0, 212, 255, 0.5);
            }
        }

        .table-container {
            overflow-x: auto;
            margin: 30px 0;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }

        .student-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }

        .student-table thead {
            background: linear-gradient(135deg, #e94560, #ff6b9d);
            color: white;
        }

        .student-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 0.9em;
        }

        .student-table tbody tr {
            border-bottom: 1px solid #e0e0e0;
            transition: background-color 0.3s ease;
        }

        .student-table tbody tr:hover {
            background-color: #f5f5f5;
        }

        .table-cell {
            padding: 12px 15px;
            color: #333;
        }

        .record-count {
            color: #16213e;
            font-weight: 600;
            margin-top: 15px;
            padding: 10px 15px;
            background: rgba(233, 69, 96, 0.1);
            border-radius: 10px;
            display: inline-block;
        }

        .decoration {
            margin-top: 50px;
            font-size: 3em;
            letter-spacing: 15px;
            animation: float-emoji 3s ease-in-out infinite;
        }

        @keyframes float-emoji {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
        }

        .tech-stack {
            margin-top: 40px;
            padding-top: 30px;
            border-top: 2px solid rgba(26, 26, 46, 0.1);
        }

        .tech-label {
            color: #16213e;
            font-size: 0.95em;
            font-weight: 500;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .tech-icons {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .tech-icon {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2em;
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-radius: 15px;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            cursor: pointer;
        }

        .tech-icon:hover {
            transform: translateY(-10px) rotate(10deg);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 800px) {
            .container {
                padding: 40px 25px;
            }

            h1 {
                font-size: 2.5em;
            }

            h2 {
                font-size: 1.4em;
            }

            .info-grid {
                grid-template-columns: 1fr;
            }

            .emoji-animation {
                font-size: 3em;
                margin-right: 10px;
            }

            .student-table {
                font-size: 0.9em;
            }

            .student-table th,
            .table-cell {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="bg-animation">
        <div class="floating-shape shape1"></div>
        <div class="floating-shape shape2"></div>
        <div class="floating-shape shape3"></div>
    </div>

    <div class="container">
        <div class="header">
            <span class="emoji-animation">🚀</span>
            <h1>Server Online</h1>
            <div class="subtitle">Web Server Gateway + PostgreSQL Database</div>
        </div>

        <div class="info-grid">
            <div class="info-card">
                <div class="info-card-label">👨‍💼 Owner</div>
                <div class="info-card-value">นายรพีพัทธ์ เจริญรัญวุฒิกุล</div>
            </div>
            
            <div class="info-card">
                <div class="info-card-label">🎓 Student ID</div>
                <div class="info-card-value">[ใส่รหัสของคุณ]</div>
            </div>
        </div>

        <div class="status-badge">
            ✓ ระบบกำลังทำงานได้อย่างสมบูรณ์
        </div>

        <h2>📚 ข้อมูลนักศึกษา</h2>
        <div class="table-container">
            <table class="student-table">
                <thead>
                    <tr>
                        <th>รหัสนักศึกษา</th>
                        <th>ชื่อ-นามสกุล</th>
                        <th>อีเมล</th>
                    </tr>
                </thead>
                <tbody>
                    ${studentTableHTML}
                </tbody>
            </table>
        </div>
        <div class="record-count">
            📊 จำนวนนักศึกษาทั้งหมด: ${result.rows.length} คน
        </div>

        <div class="tech-stack">
            <div class="tech-label">⚡ Tech Stack</div>
            <div class="tech-icons">
                <div class="tech-icon" title="Node.js">📦</div>
                <div class="tech-icon" title="HTTP">🌐</div>
                <div class="tech-icon" title="JavaScript">💛</div>
                <div class="tech-icon" title="PostgreSQL">🐘</div>
                <div class="tech-icon" title="HTML5">🏗️</div>
                <div class="tech-icon" title="CSS3">🎨</div>
            </div>
        </div>

        <div class="decoration">
            🔥 💻 ⚙️
        </div>
    </div>
</body>
</html>
  `);

} catch (err) {
  // กรณีเชื่อมต่อไม่ได้หรือเขียนชื่อตารางผิด
  console.error('Database Error:', err);
  res.end(`
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700;800&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .error-container {
            background: rgba(255, 255, 255, 0.95);
            padding: 50px;
            border-radius: 30px;
            text-align: center;
            max-width: 600px;
            box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
        }
        h1 {
            color: #e94560;
            font-size: 2.5em;
            margin: 20px 0;
        }
        p {
            color: #333;
            font-size: 1.1em;
            line-height: 1.6;
        }
        .error-code {
            background: #f0f0f0;
            padding: 20px;
            border-radius: 10px;
            text-align: left;
            margin: 20px 0;
            color: #666;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <h1>⚠️ เกิดข้อผิดพลาด</h1>
        <p><strong>ไม่สามารถเชื่อมต่อฐานข้อมูลได้</strong></p>
        <div class="error-code">
            <strong>Error Message:</strong><br>
            ${err.message}
        </div>
        <p style="color: #999; margin-top: 30px; font-size: 0.9em;">
            โปรดตรวจสอบ:<br>
            ✓ DATABASE_URL ในตัวแปร Environment<br>
            ✓ ชื่อตารางและคอลัมน์ในฐานข้อมูล<br>
            ✓ การเชื่อมต่อเครือข่าย
        </p>
    </div>
</body>
</html>
  `);
}

});

// 4. สั่งให้เซิร์ฟเวอร์เริ่มต้นเปิดรับฟังการเชื่อมต่อตามพอร์ตที่กำหนดไว้
server.listen(port, () => {
console.log(`🚀 Server is running! เครื่องแม่ข่ายเปิดทำงานแล้วที่ช่องทาง: ${port}`);
console.log(`📊 Connected to PostgreSQL Database`);
});
