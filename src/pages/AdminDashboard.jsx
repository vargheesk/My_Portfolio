import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState([]);
    const [profile, setProfile] = useState(null);
    const [experience, setExperience] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certificates, setCertificates] = useState([]);

    const [editingProject, setEditingProject] = useState(null);
    const [editingExperience, setEditingExperience] = useState(null);
    const [editingSkill, setEditingSkill] = useState(null);
    const [editingCertificate, setEditingCertificate] = useState(null);

    const [activeTab, setActiveTab] = useState("projects"); // projects, experience, skills, certificates
    const [isFormOpen, setIsFormOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (!session) navigate("/login");
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) navigate("/login");
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (session) {
            fetchProjects();
            fetchProfile();
            fetchExperience();
            fetchSkills();
            fetchCertificates();
        }
    }, [session]);

    async function fetchProjects() {
        const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
        setProjects(data || []);
    }

    async function fetchProfile() {
        const { data } = await supabase.from("profile").select("*").single();
        setProfile(data || {});
    }

    async function fetchExperience() {
        const { data } = await supabase.from("experience").select("*").order("start_date", { ascending: false });
        setExperience(data || []);
    }

    async function fetchSkills() {
        const { data } = await supabase.from("skills").select("*").order("created_at", { ascending: true });
        setSkills(data || []);
    }

    async function fetchCertificates() {
        const { data } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
        setCertificates(data || []);
    }

    async function handleDelete(id) {
        if (confirm("Are you sure you want to delete this project?")) {
            await supabase.from("projects").delete().eq("id", id);
            fetchProjects();
        }
    }

    function convertGoogleDriveLink(url) {
        if (!url) return url;
        try {
            if (url.includes("drive.google.com")) {
                const fileIdMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
                const fileId = fileIdMatch ? (fileIdMatch[1] || fileIdMatch[2]) : null;
                if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
            }
        } catch (e) {
            console.error("Error converting Drive link:", e);
        }
        return url;
    }

    async function handleSaveProfile(e) {
        e.preventDefault();
        console.log("Saving profile...");
        const formData = new FormData(e.target);

        const rawResumeUrl = formData.get("resume_url");
        const processedResumeUrl = convertGoogleDriveLink(rawResumeUrl);

        const profileData = {
            heading: formData.get("heading"),
            title: formData.get("title"),
            bio: formData.get("bio"),
            avatar_url: formData.get("avatar_url"),
            resume_url: processedResumeUrl,
            github_url: formData.get("github_url"),
            linkedin_url: formData.get("linkedin_url"),
            email: formData.get("email"),
        };
        console.log("Profile Data:", profileData);

        if (!session?.user?.id) {
            alert("User session not found. Please log in again.");
            return;
        }

        const { data, error } = await supabase.from("profile").upsert({ id: session.user.id, ...profileData }).select();

        if (error) {
            console.error("Profile Update Error:", error);
            alert("Error updating profile: " + error.message);
        } else {
            console.log("Profile Updated:", data);
            alert("Profile updated successfully!");
            fetchProfile();
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectData = {
            title: formData.get("title"),
            description: formData.get("description"),
            image_url: formData.get("image_url"),
            github_url: formData.get("github_url"),
            demo_url: formData.get("demo_url"),
            tags: formData.get("tags").split(",").map(t => t.trim()),
            is_featured: formData.get("is_featured") === "on",
        };

        let error;
        if (editingProject) {
            const res = await supabase.from("projects").update(projectData).eq("id", editingProject.id);
            error = res.error;
        } else {
            const res = await supabase.from("projects").insert([projectData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingProject(null);
            fetchProjects();
        }
    }

    async function handleSaveExperience(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const expData = {
            role: formData.get("role"),
            company: formData.get("company"),
            start_date: formData.get("start_date"),
            end_date: formData.get("end_date") || null,
            description: formData.get("description"),
            display_order: parseInt(formData.get("display_order") || 0),
        };

        let error;
        if (editingExperience) {
            const res = await supabase.from("experience").update(expData).eq("id", editingExperience.id);
            error = res.error;
        } else {
            const res = await supabase.from("experience").insert([expData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingExperience(null);
            fetchExperience();
        }
    }

    async function handleSaveSkill(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const skillData = {
            name: formData.get("name"),
            category: formData.get("category"),
        };

        let error;
        if (editingSkill) {
            const res = await supabase.from("skills").update(skillData).eq("id", editingSkill.id);
            error = res.error;
        } else {
            const res = await supabase.from("skills").insert([skillData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingSkill(null);
            fetchSkills();
        }
    }

    async function handleSaveCertificate(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const certData = {
            title: formData.get("title"),
            issuer: formData.get("issuer"),
            image_url: formData.get("image_url"),
            credential_url: formData.get("credential_url"),
        };

        let error;
        if (editingCertificate) {
            const res = await supabase.from("certificates").update(certData).eq("id", editingCertificate.id);
            error = res.error;
        } else {
            const res = await supabase.from("certificates").insert([certData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingCertificate(null);
            fetchCertificates();
        }
    }

    async function handleDeleteItem(table, id, fetcher) {
        if (confirm("Are you sure you want to delete this item?")) {
            await supabase.from(table).delete().eq("id", id);
            fetcher();
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        setProfile(data || {});
    }

    async function fetchExperience() {
        const { data } = await supabase.from("experience").select("*").order("start_date", { ascending: false });
        setExperience(data || []);
    }

    async function fetchSkills() {
        const { data } = await supabase.from("skills").select("*").order("created_at", { ascending: true });
        setSkills(data || []);
    }

    async function fetchCertificates() {
        const { data } = await supabase.from("certificates").select("*").order("created_at", { ascending: false });
        setCertificates(data || []);
    }

    // The original handleDelete function is replaced by handleDeleteItem for all sections.
    // async function handleDelete(id) {
    //     if (confirm("Are you sure you want to delete this project?")) {
    //         await supabase.from("projects").delete().eq("id", id);
    //         fetchProjects();
    //     }
    // }

    function convertGoogleDriveLink(url) {
        if (!url) return url;
        try {
            if (url.includes("drive.google.com")) {
                const fileIdMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
                const fileId = fileIdMatch ? (fileIdMatch[1] || fileIdMatch[2]) : null;
                if (fileId) return `https://drive.google.com/uc?export=download&id=${fileId}`;
            }
        } catch (e) {
            console.error("Error converting Drive link:", e);
        }
        return url;
    }

    async function handleSaveProfile(e) {
        e.preventDefault();
        console.log("Saving profile...");
        const formData = new FormData(e.target);

        const rawResumeUrl = formData.get("resume_url");
        const processedResumeUrl = convertGoogleDriveLink(rawResumeUrl);

        const profileData = {
            heading: formData.get("heading"),
            title: formData.get("title"),
            bio: formData.get("bio"),
            avatar_url: formData.get("avatar_url"),
            resume_url: processedResumeUrl,
            github_url: formData.get("github_url"),
            linkedin_url: formData.get("linkedin_url"),
            email: formData.get("email"),
        };
        console.log("Profile Data:", profileData);

        if (!session?.user?.id) {
            alert("User session not found. Please log in again.");
            return;
        }

        const { data, error } = await supabase.from("profile").upsert({ id: session.user.id, ...profileData }).select();

        if (error) {
            console.error("Profile Update Error:", error);
            alert("Error updating profile: " + error.message);
        } else {
            console.log("Profile Updated:", data);
            alert("Profile updated successfully!");
            fetchProfile();
        }
    }

    async function handleSave(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const projectData = {
            title: formData.get("title"),
            description: formData.get("description"),
            image_url: formData.get("image_url"),
            github_url: formData.get("github_url"),
            demo_url: formData.get("demo_url"),
            tags: formData.get("tags").split(",").map(t => t.trim()),
        };

        let error;
        if (editingProject) {
            const res = await supabase.from("projects").update(projectData).eq("id", editingProject.id);
            error = res.error;
        } else {
            const res = await supabase.from("projects").insert([projectData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingProject(null);
            fetchProjects();
        }
    }

    function parseFlexibleDate(dateStr) {
        if (!dateStr) return null;
        // If it's already a full date (YYYY-MM-DD), return it
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

        // Handle "YYYY"
        if (/^\d{4}$/.test(dateStr)) return `${dateStr}-01-01`;

        // Handle "YYYY-MM"
        if (/^\d{4}-\d{2}$/.test(dateStr)) return `${dateStr}-01`;

        // Handle "Month YYYY" or "Mon YYYY" (e.g., "Jan 2023", "January 2023")
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
        }

        return null; // Invalid format
    }

    async function handleSaveExperience(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const rawStartDate = formData.get("start_date");
        const rawEndDate = formData.get("end_date");

        const startDate = parseFlexibleDate(rawStartDate);
        const endDate = parseFlexibleDate(rawEndDate);

        if (!startDate) {
            alert("Invalid Start Date format. Please use YYYY, YYYY-MM, or YYYY-MM-DD.");
            return;
        }

        const expData = {
            role: formData.get("role"),
            company: formData.get("company"),
            start_date: startDate,
            end_date: endDate,
            description: formData.get("description"),
        };

        let error;
        if (editingExperience) {
            const res = await supabase.from("experience").update(expData).eq("id", editingExperience.id);
            error = res.error;
        } else {
            const res = await supabase.from("experience").insert([expData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingExperience(null);
            fetchExperience();
        }
    }

    async function handleSaveSkill(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const skillData = {
            name: formData.get("name"),
            category: formData.get("category"),
        };

        let error;
        if (editingSkill) {
            const res = await supabase.from("skills").update(skillData).eq("id", editingSkill.id);
            error = res.error;
        } else {
            const res = await supabase.from("skills").insert([skillData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingSkill(null);
            fetchSkills();
        }
    }

    async function handleSaveCertificate(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const certData = {
            title: formData.get("title"),
            issuer: formData.get("issuer"),
            image_url: formData.get("image_url"),
            credential_url: formData.get("credential_url"),
        };

        let error;
        if (editingCertificate) {
            const res = await supabase.from("certificates").update(certData).eq("id", editingCertificate.id);
            error = res.error;
        } else {
            const res = await supabase.from("certificates").insert([certData]);
            error = res.error;
        }

        if (error) alert("Error: " + error.message);
        else {
            setIsFormOpen(false);
            setEditingCertificate(null);
            fetchCertificates();
        }
    }

    async function handleDeleteItem(table, id, fetcher) {
        if (confirm("Are you sure you want to delete this item?")) {
            await supabase.from(table).delete().eq("id", id);
            fetcher();
        }
    }

    async function handleSignOut() {
        await supabase.auth.signOut();
        navigate("/");
    }

    if (loading) return <div className="p-8 text-center">Checking access...</div>;

    const tabs = [
        { id: "projects", label: "Projects" },
        { id: "experience", label: "Experience" },
        { id: "skills", label: "Skills" },
        { id: "certificates", label: "Certificates" },
        { id: "profile", label: "Profile" },
    ];

    return (
        <div className="min-h-screen pt-32 px-6 md:px-12 max-w-7xl mx-auto pb-24">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold uppercase tracking-tighter">Admin Dashboard</h1>
                <button onClick={handleSignOut} className="text-sm font-bold uppercase tracking-widest hover:opacity-50">
                    Sign Out
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-12 border-b border-border pb-4">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsFormOpen(false); }}
                        className={`text-sm font-bold uppercase tracking-widest px-4 py-2 transition-colors ${activeTab === tab.id
                            ? "bg-foreground text-background"
                            : "hover:bg-muted/50"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Projects Tab */}
            {activeTab === "projects" && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Projects</h2>
                        {!isFormOpen && (
                            <button
                                className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest"
                                onClick={() => { setEditingProject(null); setIsFormOpen(true); }}
                            >
                                Add New
                            </button>
                        )}
                    </div>

                    {isFormOpen ? (
                        <div className="mb-12 border border-border p-6">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-6">
                                {editingProject ? "Edit Project" : "New Project"}
                            </h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Title</label>
                                    <input name="title" defaultValue={editingProject?.title} className="w-full bg-transparent border border-border p-2" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Description</label>
                                    <textarea name="description" defaultValue={editingProject?.description} className="w-full bg-transparent border border-border p-2" rows={4} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Image URL</label>
                                    <input name="image_url" defaultValue={editingProject?.image_url} className="w-full bg-transparent border border-border p-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-1">GitHub URL</label>
                                        <input name="github_url" defaultValue={editingProject?.github_url} className="w-full bg-transparent border border-border p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Demo URL</label>
                                        <input name="demo_url" defaultValue={editingProject?.demo_url} className="w-full bg-transparent border border-border p-2" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Tags (comma separated)</label>
                                    <input name="tags" defaultValue={editingProject?.tags?.join(", ")} className="w-full bg-transparent border border-border p-2" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="is_featured" defaultChecked={editingProject?.is_featured} id="is_featured_project" />
                                    <label htmlFor="is_featured_project" className="text-xs font-bold uppercase tracking-widest">Featured Project (Show on Home)</label>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-widest">
                                        Save Project
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsFormOpen(false); setEditingProject(null); }}
                                        className="px-6 py-2 border border-border font-bold uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects.map((project) => (
                                <div key={project.id} className="border border-border p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{project.title}</div>
                                        <div className="text-xs text-muted-foreground">{project.id}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingProject(project); setIsFormOpen(true); }}
                                            className="text-xs uppercase font-bold hover:opacity-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem("projects", project.id, fetchProjects)}
                                            className="text-xs uppercase font-bold text-red-500 hover:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {projects.length === 0 && <div className="text-muted-foreground">No projects found.</div>}
                        </div>
                    )}
                </div>
            )}

            {/* Experience Tab */}
            {activeTab === "experience" && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Experience</h2>
                        {!isFormOpen && (
                            <button
                                className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest"
                                onClick={() => { setEditingExperience(null); setIsFormOpen(true); }}
                            >
                                Add New
                            </button>
                        )}
                    </div>

                    {isFormOpen ? (
                        <div className="mb-12 border border-border p-6">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-6">
                                {editingExperience ? "Edit Experience" : "New Experience"}
                            </h2>
                            <form onSubmit={handleSaveExperience} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Role</label>
                                        <input name="role" defaultValue={editingExperience?.role} className="w-full bg-transparent border border-border p-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Company</label>
                                        <input name="company" defaultValue={editingExperience?.company} className="w-full bg-transparent border border-border p-2" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-1">Start Date</label>
                                        <input type="text" name="start_date" defaultValue={editingExperience?.start_date} className="w-full bg-transparent border border-border p-2" placeholder="YYYY, YYYY-MM, or YYYY-MM-DD" required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest mb-1">End Date</label>
                                        <input type="text" name="end_date" defaultValue={editingExperience?.end_date} className="w-full bg-transparent border border-border p-2" placeholder="Leave empty if Present" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Description</label>
                                    <textarea name="description" defaultValue={editingExperience?.description} className="w-full bg-transparent border border-border p-2" rows={4} />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-widest">
                                        Save Experience
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsFormOpen(false); setEditingExperience(null); }}
                                        className="px-6 py-2 border border-border font-bold uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {experience.map((exp) => (
                                <div key={exp.id} className="border border-border p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{exp.role} @ {exp.company}</div>
                                        <div className="text-xs text-muted-foreground">{exp.start_date} - {exp.end_date || "Present"}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingExperience(exp); setIsFormOpen(true); }}
                                            className="text-xs uppercase font-bold hover:opacity-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem("experience", exp.id, fetchExperience)}
                                            className="text-xs uppercase font-bold text-red-500 hover:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {experience.length === 0 && <div className="text-muted-foreground">No experience found.</div>}
                        </div>
                    )}
                </div>
            )}

            {/* Skills Tab */}
            {activeTab === "skills" && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Skills</h2>
                        {!isFormOpen && (
                            <button
                                className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest"
                                onClick={() => { setEditingSkill(null); setIsFormOpen(true); }}
                            >
                                Add New
                            </button>
                        )}
                    </div>

                    {isFormOpen ? (
                        <div className="mb-12 border border-border p-6">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-6">
                                {editingSkill ? "Edit Skill" : "New Skill"}
                            </h2>
                            <form onSubmit={handleSaveSkill} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Category</label>
                                    <input name="category" defaultValue={editingSkill?.category} className="w-full bg-transparent border border-border p-2" placeholder="Language, Framework, Library..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Name</label>
                                    <input name="name" defaultValue={editingSkill?.name} className="w-full bg-transparent border border-border p-2"
                                        placeholder="Python, JavaScript, React..." />

                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-widest">
                                        Save Skill
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsFormOpen(false); setEditingSkill(null); }}
                                        className="px-6 py-2 border border-border font-bold uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {skills.map((skill) => (
                                <div key={skill.id} className="border border-border p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{skill.name}</div>
                                        <div className="text-xs text-muted-foreground">{skill.category}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingSkill(skill); setIsFormOpen(true); }}
                                            className="text-xs uppercase font-bold hover:opacity-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem("skills", skill.id, fetchSkills)}
                                            className="text-xs uppercase font-bold text-red-500 hover:opacity-50"
                                        >
                                            Del
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {skills.length === 0 && <div className="text-muted-foreground col-span-full">No skills found.</div>}
                        </div>
                    )}
                </div>
            )}

            {/* Certificates Tab */}
            {activeTab === "certificates" && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold uppercase tracking-tight">Certificates</h2>
                        {!isFormOpen && (
                            <button
                                className="px-4 py-2 bg-foreground text-background text-xs font-bold uppercase tracking-widest"
                                onClick={() => { setEditingCertificate(null); setIsFormOpen(true); }}
                            >
                                Add New
                            </button>
                        )}
                    </div>

                    {isFormOpen ? (
                        <div className="mb-12 border border-border p-6">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-6">
                                {editingCertificate ? "Edit Certificate" : "New Certificate"}
                            </h2>
                            <form onSubmit={handleSaveCertificate} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Title</label>
                                    <input name="title" defaultValue={editingCertificate?.title} className="w-full bg-transparent border border-border p-2" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Issuer</label>
                                    <input name="issuer" defaultValue={editingCertificate?.issuer} className="w-full bg-transparent border border-border p-2" required />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="is_featured" defaultChecked={editingCertificate?.is_featured} id="is_featured_cert" />
                                    <label htmlFor="is_featured_cert" className="text-xs font-bold uppercase tracking-widest">Featured Certificate (Show on Home)</label>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Image URL</label>
                                    <input name="image_url" defaultValue={editingCertificate?.image_url} className="w-full bg-transparent border border-border p-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Credential URL</label>
                                    <input name="credential_url" defaultValue={editingCertificate?.credential_url} className="w-full bg-transparent border border-border p-2" />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-widest">
                                        Save Certificate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsFormOpen(false); setEditingCertificate(null); }}
                                        className="px-6 py-2 border border-border font-bold uppercase tracking-widest"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {certificates.map((cert) => (
                                <div key={cert.id} className="border border-border p-4 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{cert.title}</div>
                                        <div className="text-xs text-muted-foreground">{cert.issuer}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingCertificate(cert); setIsFormOpen(true); }}
                                            className="text-xs uppercase font-bold hover:opacity-50"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem("certificates", cert.id, fetchCertificates)}
                                            className="text-xs uppercase font-bold text-red-500 hover:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {certificates.length === 0 && <div className="text-muted-foreground">No certificates found.</div>}
                        </div>
                    )}
                </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
                <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight mb-6">Profile Management</h2>
                    <form onSubmit={handleSaveProfile} className="space-y-6">

                        {/* Box 1: Header Info & Guide */}
                        <div className="border border-border p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Heading </label>
                                    <textarea
                                        name="heading"
                                        defaultValue={profile?.heading}
                                        className="w-full bg-transparent border border-border p-2"
                                        rows={3}
                                        placeholder="I'm <Name>..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Title / Position</label>
                                    <input
                                        name="title"
                                        defaultValue={profile?.title}
                                        className="w-full bg-transparent border border-border p-2"
                                        placeholder="Data Scientist"
                                    />
                                </div>
                            </div>
                            <div className="mb-6 p-4  bg-muted/20 text-sm">
                                <p className="font-bold mb-2">Text Formatting Guide:</p>
                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                    <li>Use <code>*text*</code> for <span className="italic">italic</span></li>
                                    <li>Use <code>&lt;text&gt;</code> for <span className="font-bold">bold</span></li>
                                    <li>Use <code>[text]</code> for <span className="text-red-600">red color</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* Box 2: Bio & Others */}
                        <div className="border border-border p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest mb-1">Bio</label>
                                <textarea
                                    name="bio"
                                    defaultValue={profile?.bio}
                                    className="w-full bg-transparent border border-border p-2"
                                    rows={6}
                                    placeholder="Enter your bio..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Avatar URL</label>
                                    <input
                                        name="avatar_url"
                                        defaultValue={profile?.avatar_url}
                                        className="w-full bg-transparent border border-border p-2"
                                        placeholder="https://..."
                                    />
                                    <p className="text-[10px] text-muted-foreground mt-1">Leave empty to use local /profile.png</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Resume URL</label>
                                    <input
                                        name="resume_url"
                                        defaultValue={profile?.resume_url}
                                        className="w-full bg-transparent border border-border p-2"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">GitHub URL</label>
                                    <input
                                        name="github_url"
                                        defaultValue={profile?.github_url}
                                        className="w-full bg-transparent border border-border p-2"
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">LinkedIn URL</label>
                                    <input
                                        name="linkedin_url"
                                        defaultValue={profile?.linkedin_url}
                                        className="w-full bg-transparent border border-border p-2"
                                        placeholder="https://linkedin.com/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest mb-1">Email</label>
                                    <input
                                        name="email"
                                        defaultValue={profile?.email}
                                        className="w-full bg-transparent border border-border p-2"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="px-6 py-2 bg-foreground text-background font-bold uppercase tracking-widest w-full">
                                    Update Profile
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
