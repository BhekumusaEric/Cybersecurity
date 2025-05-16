/**
 * i18n Configuration
 * 
 * This file sets up internationalization for the app.
 */

// Define available translations
const translations = {
  en: {
    // Common
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      cancel: 'Cancel',
      confirm: 'Confirm',
      submit: 'Submit',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      none: 'None',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      done: 'Done',
      complete: 'Complete',
      start: 'Start',
      finish: 'Finish',
      continue: 'Continue',
      review: 'Review',
      join: 'Join',
    },
    // Home
    home: {
      welcome: 'Welcome back, {{username}}!',
      yourProgress: 'Your Progress',
      coursesInProgress: 'Courses in Progress',
      completedCourses: 'Completed Courses',
      upcomingLabs: 'Upcoming Labs',
      recentCourses: 'Recent Courses',
      announcements: 'Announcements',
      viewAll: 'View All',
      lastAccessed: 'Last accessed: {{time}}',
      complete: '{{percent}}% Complete',
      home: 'Home',
    },
  },
  es: {
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Ha ocurrido un error',
      retry: 'Reintentar',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      submit: 'Enviar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      search: 'Buscar',
      filter: 'Filtrar',
      all: 'Todos',
      none: 'Ninguno',
      yes: 'Sí',
      no: 'No',
      ok: 'OK',
      done: 'Hecho',
      complete: 'Completar',
      start: 'Comenzar',
      finish: 'Finalizar',
      continue: 'Continuar',
      review: 'Revisar',
      join: 'Unirse',
    },
    // Home
    home: {
      welcome: '¡Bienvenido de nuevo, {{username}}!',
      yourProgress: 'Tu Progreso',
      coursesInProgress: 'Cursos en Progreso',
      completedCourses: 'Cursos Completados',
      upcomingLabs: 'Próximos Laboratorios',
      recentCourses: 'Cursos Recientes',
      announcements: 'Anuncios',
      viewAll: 'Ver Todos',
      lastAccessed: 'Último acceso: {{time}}',
      complete: '{{percent}}% Completado',
      home: 'Inicio',
    },
  },
};

// Create i18n instance
const i18n = {
  translations,
  locale: 'en',
  
  // Set locale
  setLocale(locale) {
    if (translations[locale]) {
      this.locale = locale;
    }
  },
  
  // Get current locale
  getLocale() {
    return this.locale;
  },
  
  // Get translation
  t(key, options) {
    try {
      // Split the key by dots
      const keys = key.split('.');
      
      // Get the translation object
      let translation = translations[this.locale];
      
      // Navigate through the nested properties
      for (const k of keys) {
        if (translation && translation[k] !== undefined) {
          translation = translation[k];
        } else {
          // If the key doesn't exist, return the key itself
          return key;
        }
      }
      
      // If the translation is a string, return it
      if (typeof translation === 'string') {
        // Replace placeholders with values from options
        if (options) {
          return Object.entries(options).reduce((acc, [key, value]) => {
            return acc.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
          }, translation);
        }
        return translation;
      }
      
      // If the translation is not a string, return the key
      return key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  },
};

export default i18n;
