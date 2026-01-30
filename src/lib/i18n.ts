import { writable } from 'svelte/store';

export type Language = 'en' | 'es';

export const currentLang = writable<Language>('es');

export const translations = {
    en: {
        nav: {
            home: 'Home',
            services: 'Services',
            about: 'About',
            contact: 'Contact',
            login: 'Login'
        },
        hero: {
            title: 'Empowering Your Business',
            subtitle: 'Premium Engineering & Creative Solutions',
            cta: 'Get Started'
        },
        services: {
            title: 'Our Services',
            beltix: {
                title: 'Beltix Agency',
                desc: 'Creative marketing and design solutions.',
                link: 'Go to Beltix'
            },
            allianzy: {
                title: 'Allianzy Consulting',
                desc: 'Top-tier engineering and technical consultancy.',
                link: 'Go to Allianzy'
            }
        },
        footer: {
            rights: 'All rights reserved.'
        },
        beltrix: {
            nav: {
                login: 'Client Login',
                start: 'Start Project'
            },
            hero: {
                title: 'UNLEASH<br>CREATIVE',
                subtitle: 'We craft digital experiences that defy expectations. Bold strategies for brands that dare to be different.',
                enter: 'Enter Dashboard'
            },
            ticker: {
                strategy: 'Strategy',
                design: 'Design',
                dev: 'Development',
                branding: 'Branding',
                marketing: 'Marketing',
                content: 'Content'
            },
            services: {
                title: 'Our Services',
                social: {
                    title: 'Social Media Management',
                    desc: 'Professional, consistent, and strategic presence on Meta, focused on organic growth and community.',
                    cta: 'Start Project'
                },
                ads: {
                    title: 'Digital Advertising',
                    desc: 'Paid campaigns on Meta Ads, Google Ads, and LinkedIn Ads focused on measurable ROI.',
                    cta: 'Start Project'
                },
                design: {
                    title: 'Social Media Design',
                    desc: 'Visual design for social media profiles and content, ensuring consistency and brand identity.',
                    cta: 'Start Project'
                },
                web: {
                    title: 'Professional Website',
                    desc: 'Design and development of clear, fast, and conversion-optimized websites.',
                    cta: 'Start Project'
                },
                brand: {
                    title: 'Visual Branding',
                    desc: 'Strong and consistent visual identity for brands looking to stand out.',
                    cta: 'Start Project'
                },
                consulting: {
                    title: 'Digital Consulting',
                    desc: 'Strategic guidance for brands and individuals who need clarity on how to start.',
                    cta: 'Start Project'
                }
            },
            process: {
                title: 'Our Continuous Optimization System',
                subtitle: 'We design and operate systems that improve over time.',
                steps: {
                    eval: {
                        title: 'Initial Evaluation',
                        items: ['We understand the context', 'Identify impact, risk, and viability', 'Define if the problem qualifies']
                    },
                    diag: {
                        title: 'Diagnosis',
                        items: ['Processes', 'Data', 'Infrastructure', 'Real constraints']
                    },
                    arch: {
                        title: 'Architecture & Design',
                        items: ['Technical architecture', 'Flows', 'Grounded decisions', 'Clear trade-offs']
                    },
                    scale: {
                        title: 'Scaling / Evolution',
                        items: ['Product', 'Platform', 'New business stage', 'Knowledge transfer']
                    },
                    measure: {
                        title: 'Measurement',
                        items: ['Real metrics', 'Performance', 'Usage', 'Costs / time / errors']
                    },
                    opt: {
                        title: 'Optimization',
                        desc: 'Adjustments. Return to Diagnosis.'
                    }
                }
            },
            testimonials: {
                title: 'What Clients Say',
                items: [
                    {
                        quote: "Beltrix transformed our brand identity completely. The results were immediate and impressive.",
                        author: "Sarah Johnson",
                        role: "CEO, TechFlow"
                    },
                    {
                        quote: "Their strategic approach to social media doubled our engagement in just two months.",
                        author: "Michael Chen",
                        role: "Marketing Director, Innovate"
                    },
                    {
                        quote: "Professional, creative, and always on time. The best agency partner we've worked with.",
                        author: "Emma Davis",
                        role: "Founder, StyleHub"
                    }
                ]
            },
            faq: {
                title: 'Frequently Asked Questions',
                items: [
                    {
                        q: "How do we start a project?",
                        a: "Simply click 'Start Project' or contact us directly. We'll schedule a discovery call to understand your needs."
                    },
                    {
                        q: "What is your typical timeline?",
                        a: "Timelines vary by project scope. Branding typically takes 2-4 weeks, while web development can take 4-8 weeks."
                    },
                    {
                        q: "Do you offer ongoing support?",
                        a: "Yes, we offer monthly retainer packages for social media management, maintenance, and continuous improvement."
                    }
                ]
            }
        }
    },
    es: {
        nav: {
            home: 'Inicio',
            services: 'Servicios',
            about: 'Nosotros',
            contact: 'Contacto',
            login: 'Ingresar'
        },
        hero: {
            title: 'Potenciando tu Negocio',
            subtitle: 'Soluciones de Ingeniería y Creatividad Premium',
            cta: 'Comenzar'
        },
        services: {
            title: 'Nuestros Servicios',
            beltix: {
                title: 'Agencia Beltix',
                desc: 'Soluciones creativas de marketing y diseño.',
                link: 'Ir a Beltix'
            },
            allianzy: {
                title: 'Consultoría Allianzy',
                desc: 'Ingeniería de primer nivel y consultoría técnica.',
                link: 'Ir a Allianzy'
            }
        },
        footer: {
            rights: 'Todos los derechos reservados.'
        },
        beltrix: {
            nav: {
                login: 'Acceso Clientes',
                start: 'Iniciar Proyecto'
            },
            hero: {
                title: 'DESATA TU<br>CREATIVIDAD',
                subtitle: 'Creamos experiencias digitales que desafían las expectativas. Estrategias audaces para marcas que se atreven a ser diferentes.',
                enter: 'Entrar al Dashboard'
            },
            ticker: {
                strategy: 'Estrategia',
                design: 'Diseño',
                dev: 'Desarrollo',
                branding: 'Branding',
                marketing: 'Marketing',
                content: 'Contenido'
            },
            services: {
                title: 'Nuestros Servicios',
                social: {
                    title: 'Gestión de Redes Sociales',
                    desc: 'Presencia profesional, consistente y estratégica en Meta, enfocada en crecimiento orgánico y comunidad.',
                    cta: 'Iniciar Proyecto'
                },
                ads: {
                    title: 'Publicidad Digital',
                    desc: 'Campañas pagas en Meta Ads, Google Ads y LinkedIn Ads enfocadas en ROI medible.',
                    cta: 'Iniciar Proyecto'
                },
                design: {
                    title: 'Diseño para Redes',
                    desc: 'Diseño visual para perfiles y contenido de redes sociales, asegurando consistencia e identidad de marca.',
                    cta: 'Iniciar Proyecto'
                },
                web: {
                    title: 'Sitios Web Profesionales',
                    desc: 'Diseño y desarrollo de sitios web claros, rápidos y optimizados para la conversión.',
                    cta: 'Iniciar Proyecto'
                },
                brand: {
                    title: 'Branding Visual',
                    desc: 'Identidad visual fuerte y consistente para marcas que buscan destacarse.',
                    cta: 'Iniciar Proyecto'
                },
                consulting: {
                    title: 'Consultoría Digital',
                    desc: 'Guía estratégica para marcas e individuos que necesitan claridad sobre cómo empezar.',
                    cta: 'Iniciar Proyecto'
                }
            },
            process: {
                title: 'Nuestro Sistema de Optimización Continua',
                subtitle: 'Diseñamos y operamos sistemas que mejoran con el tiempo.',
                steps: {
                    eval: {
                        title: 'Evaluación Inicial',
                        items: ['Entendemos el contexto', 'Identificamos impacto, riesgo y viabilidad', 'Definimos si el problema califica']
                    },
                    diag: {
                        title: 'Diagnóstico',
                        items: ['Procesos', 'Datos', 'Infraestructura', 'Restricciones reales']
                    },
                    arch: {
                        title: 'Arquitectura & Diseño',
                        items: ['Arquitectura técnica', 'Flujos', 'Decisiones fundamentadas', 'Trade-offs claros']
                    },
                    scale: {
                        title: 'Escalamiento / Evolución',
                        items: ['Producto', 'Plataforma', 'Nueva etapa del negocio', 'Transferencia de conocimiento']
                    },
                    measure: {
                        title: 'Medición',
                        items: ['Métricas reales', 'Performance', 'Uso', 'Costos / tiempos / errores']
                    },
                    opt: {
                        title: 'Optimización',
                        desc: 'Ajustes. Volvemos a Diagnóstico.'
                    }
                }
            },
            testimonials: {
                title: 'Lo Que Dicen Nuestros Clientes',
                items: [
                    {
                        quote: "Beltrix transformó nuestra identidad de marca por completo. Los resultados fueron inmediatos e impresionantes.",
                        author: "Sarah Johnson",
                        role: "CEO, TechFlow"
                    },
                    {
                        quote: "Su enfoque estratégico en redes sociales duplicó nuestro engagement en solo dos meses.",
                        author: "Michael Chen",
                        role: "Director de Marketing, Innovate"
                    },
                    {
                        quote: "Profesionales, creativos y siempre a tiempo. El mejor socio de agencia con el que hemos trabajado.",
                        author: "Emma Davis",
                        role: "Fundadora, StyleHub"
                    }
                ]
            },
            faq: {
                title: 'Preguntas Frecuentes',
                items: [
                    {
                        q: "¿Cómo iniciamos un proyecto?",
                        a: "Simplemente haz clic en 'Iniciar Proyecto' o contáctanos directamente. Agendaremos una llamada de descubrimiento para entender tus necesidades."
                    },
                    {
                        q: "¿Cuál es el tiempo típico de entrega?",
                        a: "Los tiempos varían según el alcance. El branding típicamente toma 2-4 semanas, mientras que el desarrollo web puede tomar 4-8 semanas."
                    },
                    {
                        q: "¿Ofrecen soporte continuo?",
                        a: "Sí, ofrecemos paquetes mensuales para gestión de redes sociales, mantenimiento y mejora continua."
                    }
                ]
            }
        }
    }
};
