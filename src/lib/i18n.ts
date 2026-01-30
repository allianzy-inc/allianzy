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
        }
    }
};
