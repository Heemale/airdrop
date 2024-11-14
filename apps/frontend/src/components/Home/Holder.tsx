import * as React from 'react';
import Image from 'next/image';

const Holder = () => {
  const benefits = [
    {
      number: '01',
      title: '1.Diamond Hand Incentives:',
      description:
        'The more and longer you hold, the more your points will add up, granting higher levels of benefits.',
      icon: '/home_icon1.png',
    },
    {
      number: '02',
      title: '2.Rights and interests of token exchange:',
      description:
        'After the issuance of Coral Token, points can be exchanged for tokens to participate in the CoralApp ecosystem’s shared governance and token incentive programs.',
      icon: '/home_icon2.png',
    },
    {
      number: '03',
      title: '3.Partner Airdrops:',
      description:
        'Join CoralApp and receive exclusive airdrop rewards from ecosystem partners.',
      icon: '/home_icon3.png',
    },
    {
      number: '04',
      title: '4.AI Intelligent Mining:',
      description:
        'As a smart device, CoralPhone provides mining rewards and adds value to the device.',
      icon: '/home_icon4.png',
    },
    {
      number: '05',
      title: '5.Quality Project Airdrops:',
      description:
        'Participate in CoralApp and have a chance to get airdrops from listing on top-tier exchanges and high-quality assets soon to be listed.',
      icon: '/home_icon5.png',
    },
  ];

  return (
    <div className="max-w-screen-xl flex flex-col items-start text-white">
      <h2 className="text-5xl font-bold  text-gradient mb-12">
        CoralPhone Holder Benefits 
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 w-full">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-b from-[#222] to-[#010101] text-white border-black border rounded-2xl w-[434px] h-[364px] p-6 text-left"
          >
            {/* 标号在右上角，部分超出盒子 */}
            <div className="absolute -top-4 right-3 flex items-center">
              <span className="text-7xl font-bold italic text-[#e2676f]">
                {benefit.number}
              </span>
            </div>
            {/* 图标在左上角 */}
            <div className="absolute top-3 left-3">
              <Image src={benefit.icon} alt="Icon" width={50} height={50} />
            </div>
            <h3 className="text-lg font-semibold mt-20">{benefit.title}</h3>
            <p className="text-sm leading-relaxed mt-2">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Holder;

// import * as React from 'react';
// import Image from 'next/image';

// const Holder = () => {
//   const benefits = [
//     {
//       number: '01',
//       title: 'Diamond Hand Incentives',
//       description: 'The more and longer you hold, the more your points will add up, granting higher levels of benefits.',
//       icon: '/home_icon1.png',
//     },
//     {
//       number: '02',
//       title: 'Rights and interests of token exchange',
//       description: 'After the issuance of Coral Token, points can be exchanged for tokens to participate in the CoralApp ecosystem’s shared governance and token incentive programs.',
//       icon: '/home_icon2.png',
//     },
//     {
//       number: '03',
//       title: 'Partner Airdrops',
//       description: 'Join CoralApp and receive exclusive airdrop rewards from ecosystem partners.',
//       icon: '/home_icon3.png',
//     },
//     {
//       number: '04',
//       title: 'AI Intelligent Mining',
//       description: 'As a smart device, CoralPhone provides mining rewards and adds value to the device.',
//       icon: '/home_icon4.png',
//     },
//     {
//       number: '05',
//       title: 'Quality Project Airdrops',
//       description: 'Participate in CoralApp and have a chance to get airdrops from listing on top-tier exchanges and high-quality assets soon to be listed.',
//       icon: '/home_icon5.png',
//     },
//   ];

//   return (
//     <div className="max-w-screen-xl flex flex-col items-center text-white">
//       <h2 className="text-3xl font-bold text-[#e2676f] mb-8">CoralPhone Holder Benefits</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
//         {benefits.map((benefit, index) => (
//           <div key={index} className="relative bg-gradient-to-b from-[#222] to-[#010101] text-white text-sm sm:text-2xl border-black border rounded-2xl sm:px-12 py-2 sm:py-4 w-full text-center">
//             {/* 标号在右上角，部分超出盒子 */}
//             <div className="absolute -top-4 right-3 flex items-center">
//               <span className="text-2xl font-bold text-[#e2676f]">{benefit.number}</span>
//             </div>
//             {/* 图标在左上角 */}
//             <div className="absolute top-3 left-3">
//               <Image src={benefit.icon} alt="Icon" width={50} height={50} />
//             </div>
//             <h3 className="text-lg font-semibold mt-10">{benefit.title}</h3>
//             <p className="text-sm leading-relaxed mt-2">{benefit.description}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Holder;

{
  /* <div className="max-w-screen-xl flex flex-col items-center text-white">
    //     <h2 className="text-6xl font-bold text-[#e2676f] mb-10">CoralPhone Holder Benefits</h2>
        
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative">
    //       {/* Benefit 1 */
}
//       <div className="relative p-6 bg-black bg-opacity-80 rounded-lg">
//         <span className="absolute top-0 left-0 text-5xl font-bold text-[#e2676f] opacity-50">01</span>
//         <h3 className="text-lg font-semibold mb-2">Diamond Hand Incentives</h3>
//         <p>The more and longer you hold, the more your points will add up, granting higher levels of benefits.</p>
//       </div>

//       {/* Benefit 2 */}
//       <div className="relative p-6 bg-black bg-opacity-80 rounded-lg">
//         <span className="absolute top-0 left-0 text-5xl font-bold text-[#e2676f] opacity-50">02</span>
//         <h3 className="text-lg font-semibold mb-2">Rights and Interests of Token Exchange</h3>
//         <p>Points can be exchanged for tokens to participate in shared governance and token incentive programs.</p>
//       </div>

//       {/* Benefit 3 */}
//       <div className="relative p-6 bg-black bg-opacity-80 rounded-lg">
//         <span className="absolute top-0 left-0 text-5xl font-bold text-[#e2676f] opacity-50">03</span>
//         <h3 className="text-lg font-semibold mb-2">Partner Airdrops</h3>
//         <p>Join CoralApp and receive exclusive airdrop rewards from ecosystem partners.</p>
//       </div>

//       {/* Benefit 4 */}
//       <div className="relative p-6 bg-black bg-opacity-80 rounded-lg">
//         <span className="absolute top-0 left-0 text-5xl font-bold text-[#e2676f] opacity-50">04</span>
//         <h3 className="text-lg font-semibold mb-2">AI Intelligent Mining</h3>
//         <p>CoralPhone provides mining rewards and adds value to the device.</p>
//       </div>

//       {/* Benefit 5 */}
//       <div className="relative p-6 bg-black bg-opacity-80 rounded-lg">
//         <span className="absolute top-0 left-0 text-5xl font-bold text-[#e2676f] opacity-50">05</span>
//         <h3 className="text-lg font-semibold mb-2">Quality Project Airdrops</h3>
//         <p>Participate in CoralApp for a chance to get airdrops from high-quality assets.</p>
//       </div>
//     </div>
//   </div> */}
