import Theme from "./components";
import image from "@frontity/html2react/processors/image";

const marsTheme = {
  name: "@frontity/mars-theme",
  roots: {
    /**
     *  In Frontity, any package can add React components to the site.
     *  We use roots for that, scoped to the `theme` namespace.
     */
    theme: Theme,
  },
  state: {
    /**
     * State is where the packages store their default settings and other
     * relevant state. It is scoped to the `theme` namespace.
     */
    theme: {
      menu: [],
      isMobileMenuOpen: false,
      featured: {
        showOnList: false,
        showOnPost: false,
      },
    },
  },
  /**
   * Actions are functions that modify the state or deal with other parts of
   * Frontity like libraries.
   */
  actions: {
    theme: {
      toggleMobileMenu: ({ state }) => {
        state.theme.isMobileMenuOpen = !state.theme.isMobileMenuOpen;
      },
      closeMobileMenu: ({ state }) => {
        state.theme.isMobileMenuOpen = false;
      },
      init: ({ libraries }) => {
        libraries.source.handlers.push({
          name: "country-info",
          priority: 1,
          pattern: "/:slug",
          func: async ({ route, params, state, libraries, force }) => {
            const response = await libraries.source.api.get({
              endpoint: "country-info",
              params: { slug: params.slug },
            });

            const [countryInfo] = await libraries.source.populate({
              response,
              state,
              force,
            });

            Object.assign(state.source.data[route], {
              id: countryInfo.id,
              type: countryInfo.type,
              isPostType: true,
              isCountryInfo: true,
            });
          },
        });
      },
    },
  },
  libraries: {
    html2react: {
      /**
       * Add a processor to `html2react` so it processes the `<img>` tags
       * inside the content HTML. You can add your own processors too
       */
      processors: [image],
    },
  },
};

export default marsTheme;
