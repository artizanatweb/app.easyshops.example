import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import React from "react";

const resources = {
    en: {
        translation: {
            "Location Image Name": "Image Name",
            "the location to which the user is assigned": "The location to which the user is assigned",
            "service template": "Service template",
            "template for this service": "Template for this service"
        }
    },
    ro: {
        translation: {
            "Users": "Utilizatori",
            "Service Templates": "Template Servicii",
            "Services": "Servicii",
            "Profile": "Profil",
            "Portfolio": "Portofoliu",
            "Email": "Adresa de email",
            "Password": "Parola",
            "Remember me": "Ține-mă minte",
            "Login": "Autentificare",
            "Validating...": "Validare utilizator...",
            "active": "activ",
            "inactive": "inactiv",
            "back": "înapoi",
            "Page content response error!": "Pagina conține erori!",
            "Add image": "Adaugă imagine",
            "Street name": "Numele străzii",
            "Street number": "Numărul străzii",
            "Location street name": "Denumirea străzii pe care se regăsește locația",
            "Location street number": "Numărul ce corespunde locației",
            "Select location county": "Selectează sectorul pentru această locație",
            "Image name or title": "Denumire sau titlu imagine",
            "Default image": "Imaginea principala",
            "Choose file": "Alege fișier",
            "Address details": "Detalii adresă",
            "Location Image Name": "Nume imagine",
            "portfolio image": "imagine portofoliu",
            "remove": "șterge",
            "cancel": "renunță",
            "the location to which the user is assigned": "Locația căreia îi este atribuit utilizatorul",
            "add location": "adaugă locație",
            "delete": "șterge",
            "edit": "modifică",
            "status": "stare",
            "description": "descriere",
            "Location phone number": "Număr de telefon locație",
            "Location email address": "Adresă email locație",
            "global name for this service": "Denumirea globala a acestui serviciu",
            "service execution time in minutes": "Timpul de execuție al serviciului în minute",
            "service name": "Nume serviciu",
            "service duration": "Durata de timp",
            "last update": "Ultima modificare",
            "actions": "Acțiuni",
            "service title": "Denumire serviciu",
            "has no services": "nu are servicii",
            "Please add some services": "Te rog sa adaugi servicii",
            "Add service": "Adauga serviciu",
            "Edit service": "Modifica serviciu",
            "service price in RON": "Pretul serviciului in moneda RON",
            "description for this service": "Scurta descriere a serviciului",
            "service description": "Descriere",
            "price": "Preț",
            "service price": "Preț",
            "service template name": "Template",
            "Shop": "Atelier",
            "Shops": "Ateliere",
            "Shop Details": "Detalii Atelier",
            "template for this service": "Șablonul utilizat de acest serviciu",
        }
    }
};

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources,
        lng: "ro", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
        // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
        // if you're using a language detector, do not define the lng option

        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

export default i18n;
