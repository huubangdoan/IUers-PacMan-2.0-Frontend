import React from 'react';
import bangImg from '../assets/bang.jpg';
import nhatImg from '../assets/nhat.jpg';
import trangImg from '../assets/trang.jpg';
import quyenImg from '../assets/quyen.jpg';
import chauImg from '../assets/chau.jpg';

function AboutUs() {
  const members = [
    { name: "Hữu Bằng", role: "Backend Dev", quote: "Quote ở đây", avatar: bangImg },
    { name: "Việt Nhật", role: "Backend / Database", quote: "Quote ở đây", avatar: nhatImg },
    { name: "Huyền Trang", role: "Database / Security", quote: "Quote ở đây", avatar: trangImg },
    { name: "Ngọc Quyền", role: "Frontend Dev", quote: "Quote ở đây", avatar: quyenImg },
    { name: "Phương Châu", role: "Frontend Dev", quote: "Quote ở đây", avatar: chauImg }
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