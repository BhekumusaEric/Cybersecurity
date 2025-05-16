import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  fr: {
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      retry: 'Réessayer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      submit: 'Soumettre',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      search: 'Rechercher',
      filter: 'Filtrer',
      all: 'Tous',
      none: 'Aucun',
      yes: 'Oui',
      no: 'Non',
      ok: 'OK',
      done: 'Terminé',
      complete: 'Compléter',
      start: 'Commencer',
      finish: 'Terminer',
      continue: 'Continuer',
      review: 'Réviser',
      join: 'Rejoindre',
    },
    // Home
    home: {
      welcome: 'Bon retour, {{username}} !',
      yourProgress: 'Votre Progression',
      coursesInProgress: 'Cours en Cours',
      completedCourses: 'Cours Terminés',
      upcomingLabs: 'Laboratoires à Venir',
      recentCourses: 'Cours Récents',
      announcements: 'Annonces',
      viewAll: 'Voir Tout',
      lastAccessed: 'Dernier accès : {{time}}',
      complete: '{{percent}}% Terminé',
      home: 'Accueil',
    },
  },
  de: {
    // Common
    common: {
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      retry: 'Wiederholen',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      submit: 'Absenden',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      search: 'Suchen',
      filter: 'Filtern',
      all: 'Alle',
      none: 'Keine',
      yes: 'Ja',
      no: 'Nein',
      ok: 'OK',
      done: 'Fertig',
      complete: 'Abschließen',
      start: 'Starten',
      finish: 'Beenden',
      continue: 'Fortfahren',
      review: 'Überprüfen',
      join: 'Beitreten',
    },
    // Home
    home: {
      welcome: 'Willkommen zurück, {{username}}!',
      yourProgress: 'Dein Fortschritt',
      coursesInProgress: 'Kurse in Bearbeitung',
      completedCourses: 'Abgeschlossene Kurse',
      upcomingLabs: 'Kommende Labore',
      recentCourses: 'Kürzlich besuchte Kurse',
      announcements: 'Ankündigungen',
      viewAll: 'Alle anzeigen',
      lastAccessed: 'Letzter Zugriff: {{time}}',
      complete: '{{percent}}% Abgeschlossen',
      home: 'Startseite',
    },
  },
  zh: {
    // Common
    common: {
      loading: '加载中...',
      error: '发生错误',
      retry: '重试',
      cancel: '取消',
      confirm: '确认',
      submit: '提交',
      save: '保存',
      delete: '删除',
      edit: '编辑',
      back: '返回',
      next: '下一步',
      previous: '上一步',
      search: '搜索',
      filter: '筛选',
      all: '全部',
      none: '无',
      yes: '是',
      no: '否',
      ok: '确定',
      done: '完成',
      complete: '完成',
      start: '开始',
      finish: '结束',
      continue: '继续',
      review: '复习',
      join: '加入',
    },
    // Home
    home: {
      welcome: '欢迎回来，{{username}}！',
      yourProgress: '您的进度',
      coursesInProgress: '进行中的课程',
      completedCourses: '已完成的课程',
      upcomingLabs: '即将到来的实验',
      recentCourses: '最近的课程',
      announcements: '公告',
      viewAll: '查看全部',
      lastAccessed: '上次访问：{{time}}',
      complete: '{{percent}}% 完成',
      home: '首页',
    },
  },
};

// Create i18n instance with translations
const i18n = new I18n();
i18n.translations = translations;

// Set default locale and fallback
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Get device locale
const getDeviceLocale = (): string => {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    return locales[0].languageCode;
  }
  return 'en';
};

// Initialize i18n with stored or device locale
export const initializeLocale = async (): Promise<void> => {
  try {
    // Try to get stored locale
    const storedLocale = await AsyncStorage.getItem('userLocale');

    // Set locale to stored value or device locale
    const locale = storedLocale || getDeviceLocale();

    // Check if locale is supported, otherwise use default
    const supportedLocale = Object.keys(translations).includes(locale) ? locale : 'en';

    // Set locale
    i18n.locale = supportedLocale;
  } catch (error) {
    console.error('Error initializing locale:', error);
    i18n.locale = 'en';
  }
};

// Set locale
export const setLocale = async (locale: string): Promise<void> => {
  try {
    // Check if locale is supported
    if (!Object.keys(translations).includes(locale)) {
      throw new Error(`Locale ${locale} is not supported`);
    }

    // Set locale
    i18n.locale = locale;

    // Store locale
    await AsyncStorage.setItem('userLocale', locale);
  } catch (error) {
    console.error('Error setting locale:', error);
  }
};

// Get current locale
export const getCurrentLocale = (): string => {
  return i18n.locale;
};

// Get available locales
export const getAvailableLocales = (): string[] => {
  return Object.keys(translations);
};

// Get locale name
export const getLocaleName = (locale: string): string => {
  const localeNames: { [key: string]: string } = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    zh: '中文',
  };

  return localeNames[locale] || locale;
};

// Add event listener for locale changes
RNLocalize.addEventListener('change', () => {
  initializeLocale();
});

// Initialize locale
initializeLocale();

// Export i18n instance
export default i18n;
