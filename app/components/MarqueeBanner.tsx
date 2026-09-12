// "use client";

// const items = [
//   { icon: "🚚", text: "شحن مجاني لجميع المناطق" },
//   { icon: "💳", text: "تقسيط مريح بدون فوائد" },
//   { icon: "🛡️", text: "ضمان شامل على جميع المنتجات" },
//   { icon: "⚡", text: "أحدث الأجهزة بأفضل الأسعار" },
//   { icon: "🎁", text: "عروض حصرية يومياً" },
//   { icon: "✅", text: "منتجات أصلية 100%" },
// ];

// function TrackContent() {
//   return (
//     <>
//       {items.map((item, i) => (
//         <span key={i} className="marquee-item">
//           <span className="marquee-icon">{item.icon}</span>
//           {item.text}
//           <span className="marquee-dot">✦</span>
//         </span>
//       ))}
//     </>
//   );
// }

// export default function MarqueeBanner() {
//   return (
//     <div className="marquee-banner overflow-hidden whitespace-nowrap">
//       <div className="marquee-track inline-flex">
//         <TrackContent />
//         <TrackContent />
//       </div>
//     </div>
//   );
// }
