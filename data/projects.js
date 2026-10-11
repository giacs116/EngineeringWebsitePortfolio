const projects = [
    {
        id: 10,
        title: "Humanoid Arm",
        shortDescription: "A humanoid robot lower arm designed in SolidWorks, from the wrist joint through to a functioning gripper.",
        longDescription: "Humanoid Arm is a mechanical design project focused on building the lower arm of a humanoid robot, from the wrist joint through to a functioning gripper. The project involved selecting real actuators against strict torque, voltage, and mass constraints, then designing custom aluminum frames in SolidWorks to connect them into a single working assembly. Beyond CAD, the project required full engineering analysis, calculating the torque needed to lift a payload at full extension and sizing a motor to meet it, demonstrating how mechanical design and applied statics come together in a real robotics system.",
        year: "2026",
        role: "Robotic Manipulator Assembly",
        tech: ["SolidWorks", "Engineering Statics"],
        highlights: [
            "Selected and justified a 24V wrist actuator against hard torque, mass, and voltage constraints using real vendor datasheets",
            "Designed custom 6061-T6 aluminum wrist and forearm frames around measured actuator geometry, meeting strict mass budgets",
            "Modeled a functioning 1-DOF gripper and wrist joint with proper mate limits, verified through interference detection across the full range of motion",
            "Calculated elbow actuator torque requirements from CAD-derived mass properties and selected a motor rated to safely lift a 10 lb payload",
            "Compared multiple real actuator candidates against calculated requirements to justify a final selection"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/1QAX2ZFsc-RaUpVYZs1DJsQs54mSezNLd?usp=sharing",
        githubUrl: "",
        liveUrl: "",
        image: "assets/humanoid-arm.png",
        featured: true
    },
    {
        id: 1,
        title: "Snake",
        shortDescription: "A classic grid-based game with single and dual-player modes.",
        longDescription: "Snake is a classic grid-based game where you control a snake moving up, down, left, or right to collect apples and grow longer, while avoiding collisions. In Single-Player, the goal is to eat as many apples as possible to build your snake and achieve a high score. In Two-Player, the focus shifts to outlasting your opponent while both snakes compete for apples and space on the board.",
        year: "2024",
        role: "Single & Dual Player Interactivity System",
        tech: ["C#", "Visual Studio"],
        highlights: [
            "1-player high score mode and 2-player versus mode",
            "Difficulty settings that adjust game speed",
            "Scoreboard tracking and player color customization"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/1ZBnt_UNYdU_NiWKnVL-azBazN4bFqSzb?usp=drive_link",
        githubUrl: "",
        liveUrl: "",
        image: "assets/snake-game.png",
        featured: true
    },
    {
        id: 2,
        title: "VEX Pen-Plotter Robot",
        shortDescription: "A programmable drawing robot designed to convert coordinate-based inputs into precise physical drawings.",
        longDescription: "The VEX Pen Plotter is a programmable drawing robot designed to convert coordinate-based inputs into precise physical drawings. Built using VEX Tetrix, LEGO Technic, and custom 3D-printed components, the system uses a dual-gantry X-Y mechanism and motor-controlled marker assembly to perform both manual and automated drawing.",
        year: "2025",
        role: "Mechanical Design & Software",
        tech: ["C++", "VEX"],
        highlights: [
            "Dual-axis X-Y gantry system with automated homing and coordinate calibration",
            "Manual and fully automated drawing modes driven by C++ control logic",
            "Integrated sensors and status feedback for usability, safety, and precision"
        ],
        googleDriveUrl: "",
        githubUrl: "https://github.com/User-12691296/BestRobot.git",
        liveUrl: "",
        image: "assets/vex-plotter.jpg",
        featured: true
    },
    {
        id: 3,
        title: "The Scale",
        shortDescription: "A data visualization tool built with Streamlit and Python.",
        longDescription: "A web-based application that helps users understand their overall health by inputting physiological and cognitive metrics including heart rate, BMI, reaction speed, EQ, and IQ. The app generates a personalized composite score and was developed collaboratively using Git.",
        year: "2025-2026",
        role: "Self Assessment Platform",
        tech: ["Python", "Streamlit"],
        highlights: [
            "Interactive dashboard built with Streamlit",
            "Efficient data processing using Python",
            "User-friendly interface for data analysis"
        ],
        googleDriveUrl: "",
        githubUrl: "https://github.com/jdjashan/TheScale-.git",
        liveUrl: "",
        image: "",
        featured: true
    },
    {
        id: 4,
        title: "Keychain Assembly",
        shortDescription: "A mechanical design project created using SolidWorks.",
        longDescription: "A detailed assembly workflow focused on aligning prebuilt and custom components accurately in SolidWorks while creating clear technical drawings for manufacturing.",
        year: "2025",
        role: "SolidWorks Object Assembly & Drawing",
        tech: ["SolidWorks"],
        highlights: [
            "Assembled prebuilt and custom components using appropriate mates",
            "Applied Hole Wizard for consistent tapped holes",
            "Created assembly and part drawings with precise dimensions and tolerances"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/1XS6VpB1ZY8EgjimbJp0rREjRig4eHEPW?usp=drive_link",
        githubUrl: "",
        liveUrl: "",
        image: "assets/keychain-assembly.png",
        featured: true
    },
    {
        id: 5,
        title: "Glass Coffee Table",
        shortDescription: "A furniture design project modeled in SolidWorks.",
        longDescription: "A surface-modeling exercise focused on more advanced forms, direct editing, and precise control of shape development in SolidWorks.",
        year: "2025-2026",
        role: "SolidWorks Part: Surfaces & Direct Editing",
        tech: ["SolidWorks"],
        highlights: [
            "Splines and boundary surface workflows",
            "Surface knitting and direct body editing",
            "Patterning and combine operations"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/13bfXv5aXUWS10spbdqCY51_In5y3PaNI?usp=sharing",
        githubUrl: "",
        liveUrl: "",
        image: "assets/glass-coffee-table.png",
        featured: false
    },
    {
        id: 6,
        title: "Complex Vase",
        shortDescription: "A detailed vase design showcasing advanced surface modeling and direct editing techniques in SolidWorks.",
        longDescription: "A more sculptural CAD project built around reference planes, 3D sketches, filled surfaces, and flexible finishing operations to create a complex form.",
        year: "2025-2026",
        role: "SolidWorks Part: Surfaces & Direct Editing",
        tech: ["SolidWorks"],
        highlights: [
            "Reference planes and 3D spline sketching",
            "Filled surfaces, thicken, and combine workflows",
            "Fillets, contour cuts, and patterned finishing details"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/1FfyjJ7UVjoW-SgFoMXD9kAzBUupxvo4_?usp=sharing",
        githubUrl: "",
        liveUrl: "",
        image: "assets/complex-vase.png",
        featured: false
    },
    {
        id: 7,
        title: "Tapered Thread",
        shortDescription: "A precision modeling project demonstrating tapered thread creation in SolidWorks.",
        longDescription: "A technical threading exercise using helix and spiral geometry, reference planes, and sweep operations to produce accurate tapered thread profiles.",
        year: "2025-2026",
        role: "SolidWorks Part: Thread",
        tech: ["SolidWorks"],
        highlights: [
            "Revolved boss/base foundations",
            "Helix and spiral thread geometry",
            "Sweep-based profile creation"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/1iXPLfwGDTMbGczUvVz4oGnloBKlMKxWV?usp=sharing",
        githubUrl: "",
        liveUrl: "",
        image: "assets/tapered-thread.png",
        featured: false
    },
    {
        id: 8,
        title: "Threaded Screw",
        shortDescription: "A detailed 3D model of a threaded screw designed in SolidWorks.",
        longDescription: "A fastener-focused CAD model emphasizing accurate thread profiles, standard fastening geometry, and clean feature sequencing in SolidWorks.",
        year: "2025-2026",
        role: "SolidWorks Part: Thread",
        tech: ["SolidWorks"],
        highlights: [
            "Revolved boss/base modeling",
            "Extruded cut detailing",
            "Hole Wizard thread profile work"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/1e6oQZdFWjqL5aRrqpGVOhWAOxIcofQO4?usp=sharing",
        githubUrl: "",
        liveUrl: "",
        image: "assets/threaded-screw.png",
        featured: false
    },
    {
        id: 9,
        title: "SmartMitt",
        shortDescription: "An innovative wearable mitten prototype designed to improve safety and usability in cold environments.",
        longDescription: "SmartMitt is an innovative wearable prototype designed to improve safety and usability in cold environments. The system integrates temperature monitoring, time tracking, and interactive features into a mitten, helping prevent frostbite and hypothermia while enhancing everyday functionality. By combining simple electronics with practical mechanical design, the project demonstrates how traditional winter gear can be transformed into a smart, user-focused solution.",
        year: "2026",
        role: "Wearable Safety Prototype",
        tech: ["Arduino", "C++"],
        highlights: [
            "Monitors hand temperature and time spent outdoors to improve user safety",
            "Integrated LCD display provides real-time feedback to the user",
            "Touchscreen functionality enables smartphone use while wearing mittens",
            "Built-in grabber or tweezer mechanism allows users to pick up small objects",
            "Designed to address real-world challenges of reduced dexterity in cold climates",
            "Combines hardware prototyping, user-centered design, and practical engineering problem-solving"
        ],
        googleDriveUrl: "https://drive.google.com/drive/folders/1f4sws3K67IZBHcbrntMqNsCtpYs9uWJ-?usp=drive_link",
        githubUrl: "https://github.com/mchan5/enghacks_2026.git",
        liveUrl: "",
        image: "assets/SmartMitt.jpg",
        featured: true
    }
];

export default projects;
