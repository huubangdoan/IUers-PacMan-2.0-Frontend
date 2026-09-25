import React from 'react';

function AboutUs() {
  const members = [
    { name: "Hữu Bằng", role: "Backend Dev", quote: "Quote ở đây" },
    { name: "Việt Nhật", role: "Backend / Database", quote: "Quote ở đây" },
    { name: "Huyền Trang", role: "Database / Security", quote: "Quote ở đây" },
    { name: "Phương Châu", role: "Frontend Dev", quote: "Quote ở đây" }
  ];

  return (
    <div className="page about-page">
      <h1 className="page-heading">About Us</h1>
      <div className="members-grid">
        {members.map((member, index) => (
          <div key={index} className="member-card">
            <div className="avatar-placeholder">Ảnh thành viên</div>
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <p className="quote">"{member.quote}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutUs;