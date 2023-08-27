# Swimeeter
*A tool for managing swim meets and generating heat sheets on the fly.*

- **Author:** Bennett Lindberg
- **Date:** Summer 2023
- **Link:** [***swimeeter.com***](swimeeter.com)

## Core Features

Swimeeter is a web application that streamlines the process of creating and managing large-scale swimming competitions. The site allows its users to quickly construct swim meets consisting of numerous sessions, pools, teams, events, swimmers, and entries through an intuitive interface. Additionally, Swimeeter has built-in event seeding generation, allowing users to easily sort each event's entries into competition heats and lanes.

Swimeeter supports all of the core aspects of swim meets:
- **Meets** - Users begin creating their meets by adding a new meet to their Swimeeter account
  - **Pools** - Each meet contains a set of pools at which meet sessions can be hosted
    - **Sessions** - Each pool contains a set of sessions that will host competition events at the pool
      - **Events** - Each session contains a set of competition events in which swimmers can compete
  - **Teams** - Each meet contains a set of teams to which meet swimmers can belong
    - **Swimmers** - Each team contains a set of swimmers that can participate in competition events

After users have constructed the above scaffolding for their meets using the Swimeeter site, they can proceed to add entries to the meet's events. Two types of meet entries exist:
- **Individual entries** - individual entries pair a single swimmer to an event
- **Relay entries** - relay entries pair a set of swimmers to an event

Once users have created their meet's entries, they can use Swimeeter to generate the competition seeding for the meet's events. Swimeeter's seeding generation tools allow for quick production of competition-ready heat sheets, which sort each event's entries into competition heats and pool lanes.

## Additional Features

### User Accounts
Swimeeter supports authenticated user accounts that are securely stored in a back-end database. User accounts allow for data persistence, with user-constructed meets being stored for use whenever the user decides to log back into the site. Accessibility and cosmetic choices made by users are also preserved through user accounts.

### Data Integrity
Extensive validation checks exist on Swimeeter's front-end and back-end to ensure that users do not accidentally delete or corrupt the data associated with their meets. Confirmation and warning pop-ups also appear on the site when users attempt potentially destructive actions or attempt to duplicate data.

### Guidance
Next to most of Swimeeter's tools, settings, and forms are information buttons that guide the user as they use the site. These information buttons can be pressed to open a pop-up describing how the user should interact with the target site element. Swimeeter also displays descriptive error messages when user actions go awry, steering users toward the appropriate recourse.

### Customization
Swimeeter avoids constricting the user as they create their meets as much as possible. Although recommendations are provided to guide users to competition standards, users are free to generate meets with non-standard data. Swimeeter also allows users to customize the site's appearance, including enabling dark/light mode and turning on/off the site's animations.

### Design
Navigating around the Swimeeter site is made simple through the site's navbar and navigation tree. On larger screen sizes, the navbar displays buttons linking to the most highly-trafficked pages. Additionally, the site's horizontal navigation tree allows for quick movement within a given swim meet. Buttons are placed at the top of the site's main pages that scroll users directly to specific page sections, and Swimeeter supports a wide-range of screen sizes with its responsive design.

## Examples


## Technologies
Swimeeter was built using a collection of front-end and back-end technologies. On the front-end, Swimeeter was built using React JS, written in primarily in TypeScript, and styled using Tailwind CSS. Swimeeter's back-end was written in Python using the Django web framework, and PostgreSQL was used for the site's database management system. A more-extensive list of the technologies used to build the site is included below.

- **Front-End**
  - Technologies: React JS, Tailwind CSS, Vite, Axios
  - Languages: TypeScript, HTML, CSS
- **Back-End**
  - Technologies: Django, Django REST Framework, PostgreSQL
  - Languages: Python

## Credits
Swimeeter was built by [Bennett Lindberg](https://github.com/bennettlindberg).

All SVG icons used by Swimeeter were sourced from the [Solar Bold Icons](https://www.svgrepo.com/collection/solar-bold-icons/) collection, a set of SVG icons created by [Solar Icons](https://www.figma.com/community/file/1166831539721848736?ref=svgrepo.com) under the [CC Attribution License](https://creativecommons.org/licenses/by/4.0/) via [SVG Repo](https://www.svgrepo.com/).

Swimeeter uses the [inflect](https://pypi.org/project/inflect/) library on the back-end for pluralization purposes. Inflect is a Python library authored by [Paul Dyson](mailto:pwdyson@yahoo.com) under the [MIT license](https://opensource.org/license/mit/).