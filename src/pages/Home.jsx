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
import ResumeSection from "../components/ResumeSection";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button";
import { Link } from "react-router-dom";

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
                .eq("is_hidden", false)
                .order("start_date", { ascending: false });
            setExperience(expData || []);

            // Fetch Projects
            const { data: projData } = await supabase
                .from("projects")
                .select("*")
                .eq("is_hidden", false);
            setProjects(projData || []);

            // Fetch Skills
            const { data: skillData } = await supabase
                .from("skills")
                .select("*")
                .eq("is_hidden", false);
            setSkills(skillData || []);

            // Fetch Certificates
            const { data: certData } = await supabase
                .from("certificates")
                .select("*")
                .eq("is_hidden", false);
            setCertificates(certData || []);

            setLoading(false);
        }

        fetchData();
    }, []);

    // Collect all images that need to be preloaded
    const imagesToPreload = [
        profile?.avatar_url || "/profile.png",
        "/resume_sticker.png",
        ...projects.filter(p => p.is_featured).map(p => p.image_url).filter(Boolean),
        ...certificates.filter(c => c.is_featured).map(c => c.image_url).filter(Boolean),
    ];

    if (loading) {
        return <LoadingScreen onComplete={() => setLoading(false)} imagesToPreload={imagesToPreload} />;
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
                        <div className="prose prose-lg dark:prose-invert mb-8">
                            <ScrollReveal
                                baseOpacity={0}
                                enableBlur={true}
                                baseRotation={5}
                                blurStrength={10}
                                wordAnimationEnd="bottom center"
                                scrub={false}
                                once={true}
                                textClassName="text-xl leading-relaxed text-muted-foreground"
                            >
                                {profile?.bio || "I am a Data Scientist..."}
                            </ScrollReveal>
                        </div>
                        {profile?.resume_url && (
                            <a
                                href={profile.resume_url}
                                target="_blank"
                                className="inline-block px-8 py-3 text-sm font-normal uppercase tracking-widest border border-neutral-700 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                            >
                                Download Resume
                            </a>
                        )}
                    </div>
                    <div className="relative aspect-square bg-gray-100 dark:bg-neutral-800 overflow-hidden rounded-2xl shadow-2xl">
                        <img
                            src={profile?.avatar_url || "/profile.png"}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/profile.png";
                            }}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>


            {/* Experience Section */}
            <section id="experience" className="py-32 px-6 md:px-12 max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-20 text-center">
                    Experience
                </h2>
                <Timeline items={experience.slice(0, 3)} />
                <div className="mt-12 flex justify-end md:justify-center">
                    <Link to="/experience">
                        <InteractiveHoverButton className="rounded-md dark:bg-neutral-800 dark:text-white dark:border-neutral-700">View All Experience</InteractiveHoverButton>
                    </Link>
                </div>
            </section>






            {/* Projects Section */}
            <section id="projects" className="py-32 px-6 md:px-12 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-20">
                        Selected Works
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.filter(p => p.is_featured).map((project, index) => (
                            <ProjectCard key={project.id} project={project} index={index} />
                        ))}
                    </div>
                    <div className="mt-16 flex justify-end md:justify-center">
                        <Link to="/projects">
                            <InteractiveHoverButton className="rounded-md dark:bg-neutral-800 dark:text-white dark:border-neutral-700">View All Projects</InteractiveHoverButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Certificates Section */}
            <section className="py-32 px-6 md:px-12 bg-black text-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-12 text-center">
                        Certifications
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {certificates.filter(c => c.is_featured).map((cert) => (
                            <a
                                key={cert.id}
                                href={cert.credential_url}
                                target="_blank"
                                className="group block h-full"
                            >
                                <div className="h-full border border-white/10 bg-neutral-900 rounded-md overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
                                    <div className="aspect-[4/3] bg-muted relative overflow-hidden border-b border-white/10">
                                        {cert.image_url ? (
                                            <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs uppercase font-bold text-muted-foreground">
                                                {cert.title}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg leading-tight mb-2 text-white group-hover:text-primary transition-colors line-clamp-2">
                                            {cert.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 uppercase tracking-wider">
                                            {cert.issuer}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                    <div className="mt-12 flex justify-end md:justify-center">
                        <Link to="/certificates">
                            <InteractiveHoverButton className="rounded-md bg-white text-black hover:bg-white/90 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">View All Certifications</InteractiveHoverButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Resume Section */}
            <ResumeSection resumeUrl={profile?.resume_url} />

            {/* Contact Section */}
            <section id="contact" className="relative py-32 px-6 md:px-12 bg-black text-white overflow-hidden">
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
