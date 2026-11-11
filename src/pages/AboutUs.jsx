import React from 'react';
import bangImg from '../assets/Aboutus/Bang.webp';
import nhatImg from '../assets/Aboutus/Nhat.webp';
import trangImg from '../assets/Aboutus/Trang.webp';
import quyenImg from '../assets/Aboutus/Quyen.webp';
import chauImg from '../assets/Aboutus/Chau.webp';

function AboutUs() {
  const members = [
    { name: "Hữu Bằng", role: "Backend Dev", quote: "hahaha", avatar: bangImg },
    { name: "Việt Nhật", role: "Backend / Database", quote: "Hãy sống hết mình với bản thân", avatar: nhatImg },
    { name: "Huyền Trang", role: "Database / Security", quote: "Once you choose hope, anything’s possible ", avatar: trangImg },
    { name: "Ngọc Quyền", role: "Frontend Dev", quote: "Lê Ngọc Quyền", avatar: quyenImg },
    { name: "Phương Châu", role: "Frontend Dev", quote: "Khiêm tốn - Thật thà - Dũng cảm", avatar: chauImg }
  ];

  return (
    <div className="page about-page">
      <h1 className="page-heading">About Us</h1>
      <div className="members-grid">
        {members.map((member, index) => (
          <div key={index} className="member-card">
            <img src={member.avatar} alt={member.name} className="avatar" />
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