import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import HeroSection from "../components/HeroSection";
import LogoLoop from "../components/LogoLoop";
import VariableProximity from "../components/VariableProximity";
import Timeline from "../components/Timeline";
import ProjectCard from "../components/ProjectCard";
import ContactForm from "../components/ContactForm";
import LoadingScreen from "../components/LoadingScreen";
import ScrollReveal from "../components/ScrollReveal";
import Noise from "../components/Noise";
import { DotPattern } from "../components/magicui/dot-pattern";
import { cn } from "../lib/utils";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [experience, setExperience] = useState([]);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        async function fetchData() {
            // Fetch Profile
            const { data: profileData } = await supabase.from("profile").select("*").single();
            setProfile(profileData);

            // Fetch Experience
            const { data: expData } = await supabase
                .from("experience")
                .select("*")
                .order("start_date", { ascending: false });
            setExperience(expData || []);

            // Fetch Projects
            const { data: projData } = await supabase.from("projects").select("*");
            setProjects(projData || []);

            // Fetch Skills
            const { data: skillData } = await supabase.from("skills").select("*");
            setSkills(skillData || []);

            // Fetch Certificates
            const { data: certData } = await supabase.from("certificates").select("*");
            setCertificates(certData || []);
        }

        fetchData();
    }, []);

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} />;
    }

    // Prepare skills for Variable Proximity (Dock) and Logo Loop
    const defaultSkills = [
        { name: "TensorFlow", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
        { name: "NumPy", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg" },
        { name: "Pandas", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg" },
        { name: "AWS", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" },
        { name: "Snowflake", icon_url: "https://cdn.simpleicons.org/snowflake/white" },
        { name: "Databricks", icon_url: "https://cdn.simpleicons.org/databricks/white" },
        { name: "Hive", icon_url: "https://cdn.simpleicons.org/apachehive/white" },
        { name: "Spark", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachespark/apachespark-original.svg" },
        { name: "Docker", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
        { name: "Kubernetes", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
        { name: "Kafka", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg" },
        { name: "Python", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "Azure", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
        { name: "GitHub", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
        { name: "PyTorch", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
        { name: "Oracle", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg" },
        { name: "MySQL", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
        { name: "Airflow", icon_url: "https://cdn.simpleicons.org/apacheairflow/white" },
        { name: "Firebase", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
        { name: "VSCode", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
        { name: "Git", icon_url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
    ];

    const displaySkills = defaultSkills;
    const dockItems = displaySkills.map(s => ({ icon: s.icon_url, label: s.name }));

    return (
        <div className="relative">

            {/* Hero Section */}
            <HeroSection
                content={profile?.heading}
                title={profile?.title}
                animation={{
                    initial: { opacity: 0, y: 50 },
                    animate: { opacity: 1, y: 0 }
                }}
            />
            <br /><br /><br /><br /><br /><br /><br />
            {/* Logo Loop Banner (Separating Hero/About) */}
            <div className="py-7 border-y border-border/50 bg-black overflow-hidden">
                <LogoLoop
                    logos={dockItems.map(item => ({
                        src: item.icon,
                        alt: item.label,
                        title: item.label
                    }))}
                    speed={100}
                    direction="left"
                    logoHeight={30}
                    gap={60}
                    pauseOnHover={true}
                    scaleOnHover={false}
                    className="logo-loop-white-grey"
                    fadeOut={true}
                    fadeOutColor="#000000"
                    renderItem={(item) => (
                        <div className="flex items-center gap-3 px-4">
                            {item.src ? (
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    className="w-[50px] h-[50px] object-contain"
                                />
                            ) : (
                                <div className="w-[50px] h-[50px] flex items-center justify-center bg-white/10 rounded-full text-white font-bold text-xl">
                                    {item.title[0]}
                                </div>
                            )}
                            <span className="text-lg font-bold uppercase tracking-wider whitespace-nowrap">
                                {item.title}
                            </span>
                        </div>
                    )}
                />
            </div>

            {/* About Section */}
            <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8">
                            About Me
                        </h2>
                        <div className="prose prose-lg dark:prose-invert">
                            <ScrollReveal
                                baseOpacity={0}
                                enableBlur={true}
                                baseRotation={5}
                                blurStrength={10}
                                wordAnimationEnd="bottom center"
                                scrub={1}
                                textClassName="text-xl leading-relaxed text-muted-foreground"
                            >
                                {profile?.bio || "I am a Data Scientist passionate about uncovering insights from data..."}
                            </ScrollReveal>
                        </div>

                        <div className="mt-12 flex gap-6">
                            {profile?.resume_url && (
                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    className="px-8 py-3  text-red-600 border border-black  uppercase tracking-widest hover:opacity-50 transition-opacity"
                                >
                                    Download Resume
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="relative aspect-square bg-muted overflow-hidden rounded-2xl shadow-minimal">
                        <img
                            src={profile?.avatar_url}
                            onError={(e) => {
                                if (e.target.src.includes("profile.png")) {
                                    e.target.onerror = null;
                                    e.target.src = "https://i.postimg.cc/PxzpRWV0/Adobe-Express-file123.png";
                                } else {
                                    e.target.src = "/profile.png";
                                }
                            }}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>


            {/* Experience Section */}
            < section id="experience" className="py-32 px-6 md:px-12 max-w-5xl mx-auto" >
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-20 text-center">
                    Experience
                </h2>
                <Timeline items={experience} />
            </section >


            {/* Skills / Tech Stack (List View) */}
            <section className="relative py-32 px-6 md:px-12 border-y border-border/50 overflow-hidden bg-muted/20">
                <DotPattern
                    className={cn(
                        "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
                    )}
                />
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h3 className="text-center text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-16">
                        Technical Skill
                    </h3>

                    <div className="space-y-12">
                        {Object.entries(skills.reduce((acc, skill) => {
                            const category = skill.category || "Other";
                            if (!acc[category]) acc[category] = [];
                            acc[category].push(skill.name);
                            return acc;
                        }, {})).map(([category, skillNames]) => (
                            <div key={category} className="grid md:grid-cols-[1fr_1.5fr] gap-4 md:gap-6 items-baseline max-w-3xl mx-auto">
                                <h4 className="text-xl font-bold uppercase tracking-widest text-muted-foreground text-center md:text-right">
                                    {category} :
                                </h4>
                                <p className="text-xl md:text-2xl font-medium leading-relaxed text-center md:text-left">
                                    {skillNames.join(", ")}
                                </p>
                            </div>
                        ))}

                        {skills.length === 0 && (
                            <div className="text-center text-muted-foreground">
                                No skills found. Add them in the Admin Dashboard.
                            </div>
                        )}
                    </div>
                </div>
            </section>



            {/* Projects Section */}
            < section id="projects" className="py-32 px-6 md:px-12 bg-muted/30" >
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-20">
                        Selected Works
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                </div>
            </section >

            {/* Certificates Section */}
            < section className="py-32 px-6 md:px-12 max-w-7xl mx-auto" >
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-12 text-center">
                    Certifications
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {certificates.map((cert) => (
                        <a
                            key={cert.id}
                            href={cert.credential_url}
                            target="_blank"
                            className="group block aspect-[4/3] bg-muted relative overflow-hidden"
                        >
                            {cert.image_url ? (
                                <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs uppercase font-bold">
                                    {cert.title}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white p-4 text-center">
                                <span className="text-sm font-bold uppercase">{cert.issuer}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </section >

            {/* Contact Section */}
            < section id="contact" className="relative py-32 px-6 md:px-12 bg-black text-white overflow-hidden" >
                <Noise patternAlpha={15} />
                <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Socials & Info */}
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8">
                            Get In Touch
                        </h2>
                        <p className="text-gray-400 mb-12 text-lg">
                            Interested in collaborating or have a question? Send me a message or connect with me on social media.
                        </p>

                        <div className="flex gap-6">
                            {profile?.github_url && (
                                <a href={profile.github_url} target="_blank" className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
                                </a>
                            )}
                            {profile?.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                                </a>
                            )}
                            {profile?.email && (
                                <a href={`mailto:${profile.email}`} className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-white/5 p-8 border border-white/10 rounded-2xl">
                        <ContactForm />
                    </div>
                </div>
            </section >
        </div >
    );
}
