import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const projects = [
    {
        title: 'CONTRAIrian',
        description: 'An AI-powered "intellectual sparring partner" designed to challenge user assumptions. Built with LangChain and Streamlit, it adopts a "Devil\'s Advocate" persona to analyze arguments, expose biases, and force critical thinking rather than just agreeing with the user.',
        image_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=800&q=80',
        github_url: 'https://github.com/vargheesk/CONTRAIrian-langchain-streamlit',
        demo_url: 'https://contrairian-vke.streamlit.app/',
        tags: ['Python', 'Streamlit', 'LangChain', 'Prompt Engineering', 'Generative AI', 'Critical Thinking']
    },
    {
        title: 'RAG Chat with Doc',
        description: 'A productivity tool implementing Retrieval-Augmented Generation (RAG). It uses Google Gemini and LangChain to allow users to upload documents (PDF/Text) and chat with them. This ensures the AI answers questions based strictly on the provided data, eliminating hallucinations and increasing accuracy.',
        image_url: 'https://images.unsplash.com/photo-1568029137131-99fb50d683d1?auto=format&fit=crop&w=800&q=80',
        github_url: 'https://github.com/vargheesk/RAG-chat-with-Doc-langchain-gemini',
        demo_url: 'https://rag-chatdoc.streamlit.app/',
        tags: ['Python', 'Streamlit', 'LangChain', 'Google Gemini API', 'RAG', 'Document Analysis']
    },
    {
        title: 'MealzMapz',
        description: 'A social impact platform focused on reducing food waste and alleviating hunger. It features an interactive map to connect food donors with individuals in need or community kitchens. Unlike the AI tools, this is a full-stack web application deployed on Vercel, designed for community-scale logistics.',
        image_url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
        github_url: 'https://github.com/vargheesk/MealzMapz',
        demo_url: 'https://mealzmapz.vercel.app/',
        tags: ['Full Stack Development', 'Vercel', 'Geospatial Mapping', 'Social Impact', 'Sustainability', 'Community Platform']
    }
];

async function insertProjects() {
    console.log('Inserting projects...');

    for (const project of projects) {
        // Check if project already exists to avoid duplicates
        const { data: existing } = await supabase
            .from('projects')
            .select('id')
            .eq('title', project.title)
            .single();

        if (existing) {
            console.log(`Skipping ${project.title} (already exists)`);
            continue;
        }

        const { error } = await supabase.from('projects').insert(project);
        if (error) {
            console.error(`Error inserting ${project.title}:`, error.message);
        } else {
            console.log(`Successfully inserted ${project.title}`);
        }
    }
    console.log('Done!');
}

insertProjects();
