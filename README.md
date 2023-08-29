![SwimeeterWavesBanner](https://github.com/bennettlindberg/Swimeeter/assets/54961751/cfec0d3c-e924-406c-b770-cb968b78ad4e)

# Swimeeter
*A tool for managing swim meets and generating heat sheets on the fly.*

- **Author:** Bennett Lindberg
- **Date:** Summer 2023
- **Link:** [***swimeeter.com***](https://swimeeter.com)

## Core Features

Swimeeter is a web application that streamlines the process of creating and managing large-scale swimming competitions. The site allows its users to quickly construct swim meets consisting of numerous sessions, pools, teams, events, swimmers, and entries through an intuitive interface. Additionally, Swimeeter has built-in event seeding generation, allowing users to easily sort each event's entries into competition heats and lanes.

Swimeeter supports all of the core aspects of swim meets:
- **Meets** - Users begin creating their meets by adding a new meet to their Swimeeter account
  - **Pools** - Each meet contains a set of pools at which meet sessions can be hosted
    - **Sessions** - Each pool contains a set of sessions that will host competition events at the pool
      - **Events** - Each session contains a set of competition events in which swimmers can compete
  - **Teams** - Each meet contains a set of teams to which meet swimmers can belong
    - **Swimmers** - Each team contains a set of swimmers that can participate in competition events
   
~~IMAGE~~
_Swimeeter's meet creation form includes pre-filled fields, information buttons next to each field, and guiding information on the left-hand side bar._

~~IMAGE~~
_User-created meets appear on the meets list page, which displays every users' public meets and all of the meets created by the logged-in user._

~~IMAGE~~
_The meet overview page displays all of the core information for a meet. The side bar buttons can be used to quickly navigate between the page's sections._

After users have constructed the above scaffolding for their meets using the Swimeeter site, they can proceed to add entries to the meet's events. Two types of meet entries exist:
- **Individual entries** - individual entries pair a single swimmer to an event
- **Relay entries** - relay entries pair a set of swimmers to an event

~~IMAGE~~
_Creation forms are used to create new instances of swimmers, pools, entries, and more. Relay entry creation forms include swimmer information for each leg of the relay._

~~IMAGE~~
_Much of Swimeeter's data is displayed in tables. Swimeeter's tables are collapsible and filterable, allowing for versatile data consumption._

Once users have created their meet's entries, they can use Swimeeter to generate the competition seeding for the meet's events. Swimeeter's seeding generation tools allow for quick production of competition-ready heat sheets, which sort each event's entries into competition heats and pool lanes.

~~IMAGE~~
_A dedicated page is provided for managing a meet's seeding data. Seeding can be generated for entire meets or sessions at a time, or event-by-event. The overview section points the user toward gaps in the meet's seeding._

~~IMAGE~~
_Meet heat sheets display the heat and lane seeding data for each event of the meet. The nested tables are collapsible for easy data observation and messages are included to explain any seeding gaps._

~~IMAGE~~
_Swimeeter makes viewing a specific team or swimmer's seeding easy. Heat sheets can be viewed for specific meet items, and these more-specific sheets will display only the sessions, events, and heats that have a direct relation to the item in question._

## Additional Features

### User Accounts
Swimeeter supports authenticated user accounts that are securely stored in a back-end database. User accounts allow for data persistence, with user-constructed meets being stored for use whenever the user decides to log back into the site. Accessibility and cosmetic choices made by users are also preserved through user accounts.

~~IMAGE~~
_Swimeeter supports highly-detailed names for its users. Information such as a user's name or password can be altered in settings after account creation._

~~IMAGE~~
_Users have a high degree of autonomy with their accounts and can alter numerous account settings and details._

### Data Integrity
Extensive validation checks exist on Swimeeter's front-end and back-end to ensure that users do not accidentally delete or corrupt the data associated with their meets. Confirmation and warning pop-ups also appear on the site when users attempt potentially destructive actions or attempt to duplicate data.

~~IMAGE~~
_Pop-ups appear on screen as appropriate to alert users about their actions. If a user dislikes these pop-ups, they can turn off the destructive action confirmations in their account settings._

~~IMAGE~~
_Swimeeter attempts to maintain meet data integrity by alerting the user when they appear to be creating duplicate items. Users can choose how duplicates are handled._

### Guidance
Next to most of Swimeeter's tools, settings, and forms are information buttons that guide the user as they use the site. These information buttons can be pressed to open a pop-up describing how the user should interact with the target site element. Swimeeter also displays descriptive error messages when user actions go awry, steering users toward the appropriate recourse.

~~IMAGE~~
_Help is integrated directly into Swimeeter via information buttons next to many of the site's features. Information panes are responsive to whether or not the user is the meet host or is editing versus viewing the current item._

~~IMAGE~~
_Error messages guide the user to the source of the problem, including context for the error and recommendations for fixing the error._

### Customization
Swimeeter avoids constricting the user as they create their meets as much as possible. Although recommendations are provided to guide users to competition standards, users are free to generate meets with non-standard data. Swimeeter also allows users to customize the site's appearance, including enabling dark/light mode and turning on/off the site's animations.

~~IMAGE~~
_Many form inputs include drop-down options for common values, allowing for faster creation of meet items. Many of these form inputs still allow users to input non-standard data, however, leaving the door open for maximum meet customization._

~~IMAGE~~
_Users can alter the site's appearance in a few ways, most notably by changing their screen mode preference. Dark versus light mode selection is given a dedicated navigation bar button on larger screen sizes._

### Design
Navigating around the Swimeeter site is made simple through the site's navbar and navigation tree. On larger screen sizes, the navbar displays buttons linking to the most highly-trafficked pages. Additionally, the site's horizontal navigation tree allows for quick movement within a given swim meet. Buttons are placed at the top of the site's main pages that scroll users directly to specific page sections, and Swimeeter supports a wide-range of screen sizes with its responsive design.

~~IMAGE~~
_Swimeeter is responsive to different screen sizes and can displays well on both large monitors and small mobile phone screens._

~~IMAGE~~
_Site navigation is made snappy by Swimeeter's quick-movement features. The horizontal navigation tree at the top of the site allows for seamless travel within a meet's pages._

## Technologies
Swimeeter was built using a collection of front-end and back-end technologies. On the front-end, Swimeeter was built using React JS, written in primarily in TypeScript, and styled using Tailwind CSS. Swimeeter's back-end was written in Python using the Django web framework, and PostgreSQL was used for the site's database management system. A more-extensive list of the technologies used to build the site is included below.

[![Technologies](https://skillicons.dev/icons?i=ts,react,tailwind)](https://skillicons.dev)
[![Technologies](https://skillicons.dev/icons?i=python,django,postgres)](https://skillicons.dev)

- **Front-End**
  - Technologies: React JS, React Router, Tailwind CSS, Vite, Axios
  - Languages: TypeScript, HTML, CSS
- **Back-End**
  - Technologies: Django, Django REST Framework, PostgreSQL
  - Languages: Python

## Credits
Swimeeter was built by [Bennett Lindberg](https://github.com/bennettlindberg).

All SVG icons used by Swimeeter were sourced from the [Solar Bold Icons](https://www.svgrepo.com/collection/solar-bold-icons/) collection, a set of SVG icons created by [Solar Icons](https://www.figma.com/community/file/1166831539721848736?ref=svgrepo.com) under the [CC Attribution License](https://creativecommons.org/licenses/by/4.0/) via [SVG Repo](https://www.svgrepo.com/).

Swimeeter uses the [inflect](https://pypi.org/project/inflect/) library on the back-end for pluralization purposes. Inflect is a Python library authored by [Paul Dyson](mailto:pwdyson@yahoo.com) under the [MIT License](https://opensource.org/license/mit/).
