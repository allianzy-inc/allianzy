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
            login: 'Login',
            register: 'Start Now',
            start_eval: 'Start Evaluation',
            dashboard: 'Dashboard'
        },
        hero: {
            title: 'Where Strategy becomes System.',
            subtitle: 'We design systems, processes, and platforms for organizations that need to scale with control.',
            supporting: 'Engineering, automation, and technical consulting to transform strategic decisions into real operational structures.',
            cta: 'Start Evaluation',
            cta_secondary: 'See How We Work'
        },
        problem: {
            title: 'When strategy lacks a system, operations fragment.',
            items: [
                'Processes that depend on people and constant explanations',
                'Informal requests, out-of-scope changes, and lack of traceability',
                'Teams fighting fires instead of executing with focus',
                'Strategic decisions that don\'t trickle down to operations'
            ],
            closure_1: 'The problem isn\'t growth.',
            closure_2: 'The problem is growing without a structure to sustain it.'
        },
        capabilities: {
            title: 'Applied Engineering Capabilities',
            items: {
                custom: {
                    title: 'Custom Designed Systems',
                    desc: 'Technical and process architecture aligned with the business, not generic solutions.'
                },
                automation: {
                    title: 'Automation & Integrations',
                    desc: 'We connect tools, data, and flows to eliminate manual tasks and operational friction.'
                },
                platform: {
                    title: 'Platform & Operational Control',
                    desc: 'A single system for requests, tickets, deliverables, payments, and complete traceability.'
                },
                consulting: {
                    title: 'Real Technical Consulting',
                    desc: 'Diagnosis, criteria, and decisions. We don\'t sell hours: we design structural solutions.'
                }
            }
        },
        why_allianzy: {
            title: 'Not an agency. Applied engineering for business.',
            traditional: {
                title: 'Traditional Approaches',
                items: ['Isolated deliverables', 'Dependence on key people', 'Informal support', 'Vague scopes']
            },
            allianzy: {
                title: 'Allianzy',
                items: ['Systems with clear rules', 'Processes designed to scale', 'Real separation between support and extra work', 'Control, traceability, and strategic focus']
            },
            quote: 'Allianzy doesn\'t sell tasks. We design and operate systems.'
        },
        services: {
            title: 'Our Services',
            principle: 'Less is more. Clear blocks of high strategic value.',
            items: [
                { title: 'Technical & Process Consulting', desc: 'Deep diagnosis, architecture definition, and implementation roadmap.' },
                { title: 'System & Platform Design', desc: 'Internal platforms, dashboards, client and vendor portals.' },
                { title: 'Automation & Integrations', desc: 'APIs, data flows, system synchronization, and elimination of repetitive tasks.' },
                { title: 'Infrastructure & Maintenance', desc: 'Structural support, continuous evolution, monitoring, and system improvement.' },
                { title: 'Operational Scaling', desc: 'Service separation, vendor control, and friction-less growth.' }
            ],
            exclusion: 'We do not do: web design, social media, marketing. That is not Allianzy.',
             // Keeping legacy keys for compatibility if needed elsewhere
            beltix: {
                title: 'Beltix Agency',
                tag: 'Creative',
                desc: 'Creative marketing and design solutions.',
                link: 'Go to Beltix',
                features: ['Branding', 'UI/UX Design', 'Marketing']
            },
            allianzy: {
                title: 'Allianzy Consulting',
                tag: 'Enterprise',
                desc: 'Top-tier technical consultancy and strategy.',
                link: 'Go to Allianzy',
                features: ['Technical Strategy', 'Consulting', 'Staff Augmentation']
            }
        },
        process: {
            title: 'A clear process from the first contact.',
            steps: [
                'Quick pre-evaluation (< 2 mins)',
                'Guided problem evaluation',
                'Technical qualification call',
                'Structured proposal',
                'Implementation & Operation'
            ],
            disclaimer: 'Not all projects qualify. And that\'s part of the method.'
        },
        reviews: {
            title: 'Social Proof',
            quote: 'Allianzy transformed our strategy into a real operating system. Today the team knows what to do, when, and why.',
            author: 'Satisfied Client'
        },
        faq: {
            title: 'FAQ',
            items: [
                { q: 'Does Allianzy do websites or marketing?', a: 'No. For operational services there is a separate unit. Allianzy focuses on systems and technical consulting.' },
                { q: 'Do you work with small companies?', a: 'Only when the problem requires a real structural approach.' },
                { q: 'Do you sell hours?', a: 'No. We sell projects, systems, and solutions with defined scope.' },
                { q: 'How are changes or support requested?', a: 'Everything is managed from the platform, via tickets and formal requests.' },
                { q: 'Can I start with something small?', a: 'Yes, as long as it makes strategic sense.' }
            ]
        },
        cta_final: {
            title: 'From strategy to operation.',
            subtitle: 'If your organization is already thinking about strategy, it\'s time to turn it into a system.',
            button: 'Start Evaluation'
        },
        // Generic Footer
        footer: {
            rights: 'All rights reserved.',
            company: {
                title: 'Company',
                about: 'About',
                careers: 'Careers',
                blog: 'Blog'
            },
            product: {
                title: 'Product',
                features: 'Features',
                security: 'Security'
            },
            resources: {
                title: 'Resources',
                docs: 'Docs',
                help: 'Help Center',
                community: 'Community'
            },
            desc: 'Engineering applied to business.',
            privacy: 'Privacy Policy',
            terms: 'Terms of Service'
        },
        // Beltrix & Dashboard kept as is
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
        },
        dashboard: {
            menu: {
                overview: 'Overview',
                projects: 'Projects',
                support: 'Support',
                settings: 'Settings',
                contact: 'Contact',
                billing: 'Billing',
                manage_stripe: 'Manage in Stripe',
                admin_panel: 'Admin Panel'
            },
            footer: {
                help_support: 'Help',
                rights: 'All rights reserved.',
                made_with_love: 'Made with love'
            },
            header: {
                notifications: {
                    title: 'Notifications',
                    empty: 'You have no notifications'
                },
                profile: {
                    account: 'My Account',
                    theme: {
                        title: 'Theme',
                        light: 'Light',
                        dark: 'Dark',
                        system: 'System'
                    },
                    language: {
                        title: 'Language',
                        en: 'English',
                        es: 'Spanish'
                    },
                    logout: 'Logout'
                }
            },
            page: {
                projects: {
                    title: 'Projects',
                    subtitle: 'Manage and track your ongoing projects.'
                },
                billing: {
                    title: 'Billing',
                    subtitle: 'Manage your payments and invoices.'
                },
                support: {
                    title: 'Support',
                    subtitle: 'Get help and track your support requests.'
                },
                settings: {
                    title: 'Settings',
                    subtitle: 'Manage your account and preferences.'
                },
                // This part was malformed in previous read (nested title/subtitle directly under settings object or something). 
                // Based on previous read, it seemed 'title': 'My Account' was at the same level as 'settings'. 
                // I'll try to reconstruct carefully based on the pattern.
                // Looking at lines 339-340 in previous read, it seems like there was a missing key or it was part of 'profile' page but indentation was off.
                // Assuming there is a 'profile' section.
                profile: {
                    title: 'My Account',
                    subtitle: 'Manage your personal information.',
                    personal_info: {
                        title: 'Personal Information',
                        avatar: {
                            label: 'Profile Photo',
                            desc: 'Your photo will be shown in your profile and comments.',
                            delete_confirm: {
                                title: 'Are you sure?',
                                desc: 'This action will remove your current profile photo.',
                                cancel: 'Cancel',
                                delete: 'Delete'
                            },
                            delete_tooltip: 'Remove photo'
                        },
                        name: 'First Name',
                        lastname: 'Last Name',
                        email: 'Email',
                        phone: 'Phone'
                    },
                    addresses: {
                        title: 'Addresses',
                        add_button: 'Add Address',
                        form: {
                            label: 'Label (e.g. Home, Office)',
                            address: 'Full Address',
                            city: 'City',
                            country: 'Country',
                            cancel: 'Cancel',
                            save: 'Save Address'
                        }
                    },
                    documents: {
                        title: 'Identity Documents',
                        add_button: 'Add Document',
                        form: {
                            type: 'Type (e.g. ID, Tax ID)',
                            value: 'Document Number',
                            cancel: 'Cancel',
                            save: 'Save Document'
                        }
                    },
                    links: {
                        title: 'Interest Links',
                        add_button: 'Add Link',
                        form: {
                            title: 'Title (e.g. LinkedIn)',
                            url: 'URL',
                            cancel: 'Cancel',
                            save: 'Save Link'
                        }
                    },
                    saved: 'Saved'
                }
            }
        }
    },
    es: {
        nav: {
            home: 'Inicio',
            services: 'Servicios',
            about: 'Nosotros',
            contact: 'Contacto',
            login: 'Acceso',
            start_eval: 'Iniciar evaluación',
            dashboard: 'Dashboard'
        },
        hero: {
            title: 'Donde la estrategia se convierte en sistema.',
            subtitle: 'Diseñamos sistemas, procesos y plataformas para organizaciones que necesitan escalar con control.',
            supporting: 'Ingeniería, automatización y consultoría técnica para transformar decisiones estratégicas en estructuras operativas reales.',
            cta: 'Iniciar evaluación',
            cta_secondary: 'Ver cómo trabajamos'
        },
        problem: {
            title: 'Cuando la estrategia no tiene sistema, la operación se fragmenta.',
            items: [
                'Procesos que dependen de personas y explicaciones constantes',
                'Pedidos informales, cambios fuera de alcance y falta de trazabilidad',
                'Equipos apagando incendios en lugar de ejecutar con foco',
                'Decisiones estratégicas que no bajan a la operación'
            ],
            closure_1: 'El problema no es crecer.',
            closure_2: 'El problema es crecer sin una estructura que lo sostenga.'
        },
        capabilities: {
            title: 'Capacidades clave',
            items: {
                custom: {
                    title: 'Sistemas diseñados a medida',
                    desc: 'Arquitectura técnica y de procesos alineada al negocio, no soluciones genéricas.'
                },
                automation: {
                    title: 'Automatización e integraciones',
                    desc: 'Conectamos herramientas, datos y flujos para eliminar tareas manuales y fricción operativa.'
                },
                platform: {
                    title: 'Plataforma y control operativo',
                    desc: 'Un único sistema para pedidos, tickets, entregables, pagos y trazabilidad completa.'
                },
                consulting: {
                    title: 'Consultoría técnica real',
                    desc: 'Diagnóstico, criterio y decisiones. No vendemos horas: diseñamos soluciones estructurales.'
                }
            }
        },
        why_allianzy: {
            title: 'No somos una agencia. Somos ingeniería aplicada al negocio.',
            traditional: {
                title: 'Enfoques tradicionales',
                items: ['Entregables aislados', 'Dependencia de personas clave', 'Soporte informal', 'Alcances difusos']
            },
            allianzy: {
                title: 'Allianzy',
                items: ['Sistemas con reglas claras', 'Procesos diseñados para escalar', 'Separación real entre soporte y trabajo adicional', 'Control, trazabilidad y foco estratégico']
            },
            quote: 'Allianzy no vende tareas. Diseña y opera sistemas.'
        },
        services: {
            title: 'Nuestros Servicios',
            principle: 'Menos es más. Bloques claros, de alto valor estratégico.',
            items: [
                { title: 'Consultoría técnica y de procesos', desc: 'Diagnóstico profundo, definición de arquitectura y roadmap de implementación.' },
                { title: 'Diseño de sistemas y plataformas', desc: 'Plataformas internas, dashboards, portales de clientes y proveedores.' },
                { title: 'Automatización e integraciones', desc: 'APIs, flujos de datos, sincronización de sistemas y eliminación de tareas repetitivas.' },
                { title: 'Infraestructura y mantenimiento', desc: 'Soporte estructural, evolución continua, monitoreo y mejora del sistema.' },
                { title: 'Escalamiento operativo', desc: 'Separación de servicios, control de proveedores y crecimiento sin fricción.' }
            ],
            exclusion: 'No incluir: diseño web, redes sociales, marketing. Eso no es Allianzy.',
            beltix: {
                title: 'Beltix Agency',
                tag: 'Creativo',
                desc: 'Soluciones creativas de marketing y diseño.',
                link: 'Ir a Beltix',
                features: ['Branding', 'Diseño UI/UX', 'Marketing']
            },
            allianzy: {
                title: 'Allianzy Consulting',
                tag: 'Empresarial',
                desc: 'Consultoría técnica y estratégica de alto nivel.',
                link: 'Ir a Allianzy',
                features: ['Estrategia Técnica', 'Consultoría', 'Staff Augmentation']
            }
        },
        process: {
            title: 'Un proceso claro desde el primer contacto.',
            steps: [
                'Pre-evaluación rápida (menos de 2 minutos)',
                'Evaluación guiada del problema',
                'Llamada técnica de calificación',
                'Propuesta estructurada',
                'Implementación y operación'
            ],
            disclaimer: 'No todos los proyectos califican. Y eso es parte del método.'
        },
        reviews: {
            title: 'Social Proof',
            quote: 'Allianzy transformó nuestra estrategia en un sistema operativo real. Hoy el equipo sabe qué hacer, cuándo y por qué.',
            author: 'Cliente Satisfecho'
        },
        faq: {
            title: 'FAQ',
            items: [
                { q: '¿Allianzy hace sitios web o marketing?', a: 'No. Para servicios operativos existe una unidad separada. Allianzy se enfoca en sistemas y consultoría técnica.' },
                { q: '¿Trabajan con empresas pequeñas?', a: 'Solo cuando el problema requiere un enfoque estructural real.' },
                { q: '¿Venden horas?', a: 'No. Vendemos proyectos, sistemas y soluciones con alcance definido.' },
                { q: '¿Cómo se solicitan cambios o soporte?', a: 'Todo se gestiona desde la plataforma, mediante tickets y pedidos formales.' },
                { q: '¿Puedo empezar con algo chico?', a: 'Sí, siempre que tenga sentido estratégico.' }
            ]
        },
        cta_final: {
            title: 'De la estrategia a la operación.',
            subtitle: 'Si tu organización ya piensa en estrategia, es momento de convertirla en sistema.',
            button: 'Iniciar evaluación'
        },
        footer: {
            rights: 'Todos los derechos reservados.',
            company: {
                title: 'Compañía',
                about: 'Nosotros',
                careers: 'Carreras',
                blog: 'Blog'
            },
            product: {
                title: 'Producto',
                features: 'Características',
                security: 'Seguridad'
            },
            resources: {
                title: 'Recursos',
                docs: 'Documentación',
                help: 'Centro de Ayuda',
                community: 'Comunidad'
            },
            desc: 'Ingeniería aplicada al negocio.',
            privacy: 'Política de Privacidad',
            terms: 'Términos de Servicio'
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
        },
        dashboard: {
            menu: {
                overview: 'Inicio',
                projects: 'Proyectos',
                support: 'Soporte',
                settings: 'Configuraciones',
                contact: 'Contactar',
                billing: 'Facturación',
                manage_stripe: 'Administrar en Stripe',
                admin_panel: 'Panel de Admin'
            },
            footer: {
                help_support: 'Ayuda',
                rights: 'Todos los derechos reservados.',
                made_with_love: 'Hecho con amor'
            },
            header: {
                notifications: {
                    title: 'Notificaciones',
                    empty: 'No tienes notificaciones'
                },
                profile: {
                    account: 'Mi cuenta',
                    theme: {
                        title: 'Tema',
                        light: 'Claro',
                        dark: 'Oscuro',
                        system: 'Sistema'
                    },
                    language: {
                        title: 'Idioma',
                        en: 'English',
                        es: 'Español'
                    },
                    logout: 'Cerrar Sesión'
                }
            },
            page: {
                projects: {
                    title: 'Proyectos',
                    subtitle: 'Gestiona y sigue tus proyectos en curso.'
                },
                billing: {
                    title: 'Facturación',
                    subtitle: 'Gestiona tus pagos y facturas.'
                },
                support: {
                    title: 'Soporte',
                    subtitle: 'Obtén ayuda y sigue tus solicitudes de soporte.'
                },
                settings: {
                    title: 'Configuraciones',
                    subtitle: 'Gestiona tu cuenta y preferencias.'
                },
                profile: {
                    title: 'Mi Cuenta',
                    subtitle: 'Gestiona tu información personal.',
                    personal_info: {
                        title: 'Información Personal',
                        avatar: {
                            label: 'Foto de Perfil',
                            desc: 'Tu foto se mostrará en tu perfil y comentarios.',
                            delete_confirm: {
                                title: '¿Estás seguro?',
                                desc: 'Esta acción eliminará tu foto de perfil actual.',
                                cancel: 'Cancelar',
                                delete: 'Eliminar'
                            },
                            delete_tooltip: 'Eliminar foto'
                        },
                        name: 'Nombre',
                        lastname: 'Apellido',
                        email: 'Email',
                        phone: 'Teléfono'
                    },
                    addresses: {
                        title: 'Direcciones',
                        add_button: 'Agregar Dirección',
                        form: {
                            label: 'Etiqueta (ej. Casa, Oficina)',
                            address: 'Dirección completa',
                            city: 'Ciudad',
                            country: 'País',
                            cancel: 'Cancelar',
                            save: 'Guardar Dirección'
                        }
                    },
                    documents: {
                        title: 'Documentos de Identidad',
                        add_button: 'Agregar Documento',
                        form: {
                            type: 'Tipo (ej. DNI, RUC)',
                            value: 'Número de Documento',
                            cancel: 'Cancelar',
                            save: 'Guardar Documento'
                        }
                    },
                    links: {
                        title: 'Enlaces de Interés',
                        add_button: 'Agregar Enlace',
                        form: {
                            title: 'Título (ej. LinkedIn)',
                            url: 'URL',
                            cancel: 'Cancelar',
                            save: 'Guardar Enlace'
                        }
                    },
                    saved: 'Guardado'
                }
            }
        }
    }
};
