import prisma from "@/lib/prisma";

export default async function SliderStyles() {
  const settings = await prisma.setting.findMany();
  const settingsMap = settings.reduce((acc: any, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {});

  const arrowColor = settingsMap['sliderArrowColor'] || '#ff1493'; // Default to pink
  const arrowStyle = settingsMap['sliderArrowStyle'] || 'default';

  let customIconCSS = '';
  
  if (arrowStyle === 'solid') {
    customIconCSS = `
      .swiper-button-next::after {
        content: '\\27A4' !important; /* Solid right arrow */
        font-size: 32px !important;
      }
      .swiper-button-prev::after {
        content: '\\27A4' !important; 
        font-size: 32px !important;
        transform: rotate(180deg);
      }
    `;
  } else if (arrowStyle === 'circle') {
    customIconCSS = `
      .swiper-button-next, .swiper-button-prev {
        background-color: var(--swiper-navigation-color);
        color: white !important;
        border-radius: 50%;
        width: 44px !important;
        height: 44px !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
      }
      .swiper-button-next::after, .swiper-button-prev::after {
        font-size: 18px !important;
        font-weight: 900;
        --swiper-navigation-color: white; /* Make inner icon white */
      }
    `;
  } else if (arrowStyle === 'bold') {
    customIconCSS = `
      .swiper-button-next::after, .swiper-button-prev::after {
        font-weight: 900 !important;
        text-shadow: 2px 2px 0px rgba(255,255,255,0.8);
      }
    `;
  }

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        :root {
          --swiper-navigation-color: ${arrowColor} !important;
        }
        ${customIconCSS}
      `
    }} />
  );
}
