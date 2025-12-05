import Layout from "./Layout.jsx";

import Dashboard from "./Dashboard";

import Tournaments from "./Tournaments";

import Pokedex from "./Pokedex";

import Analytics from "./Analytics";

import Home from "./Home";

import Blog from "./Blog";

import BlogPost from "./BlogPost";

import RomLibrary from "./RomLibrary";

import RomDetail from "./RomDetail";

import PokemonDetail from "./PokemonDetail";

import GuidesIndex from "./GuidesIndex";

import GuideDetail from "./GuideDetail";

import TournamentDetail from "./TournamentDetail";

import AdminPosts from "./AdminPosts";

import AdminROMs from "./AdminROMs";

import AdminTournaments from "./AdminTournaments";

import AdminGuides from "./AdminGuides";

import AdminPokedex from "./AdminPokedex";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Dashboard: Dashboard,
    
    Tournaments: Tournaments,
    
    Pokedex: Pokedex,
    
    Analytics: Analytics,
    
    Home: Home,
    
    Blog: Blog,
    
    BlogPost: BlogPost,
    
    RomLibrary: RomLibrary,
    
    RomDetail: RomDetail,
    
    PokemonDetail: PokemonDetail,
    
    GuidesIndex: GuidesIndex,
    
    GuideDetail: GuideDetail,
    
    TournamentDetail: TournamentDetail,
    
    AdminPosts: AdminPosts,
    
    AdminROMs: AdminROMs,
    
    AdminTournaments: AdminTournaments,
    
    AdminGuides: AdminGuides,
    
    AdminPokedex: AdminPokedex,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Dashboard />} />
                
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Tournaments" element={<Tournaments />} />
                
                <Route path="/Pokedex" element={<Pokedex />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/BlogPost" element={<BlogPost />} />
                
                <Route path="/RomLibrary" element={<RomLibrary />} />
                
                <Route path="/RomDetail" element={<RomDetail />} />
                
                <Route path="/PokemonDetail" element={<PokemonDetail />} />
                
                <Route path="/GuidesIndex" element={<GuidesIndex />} />
                
                <Route path="/GuideDetail" element={<GuideDetail />} />
                
                <Route path="/TournamentDetail" element={<TournamentDetail />} />
                
                <Route path="/AdminPosts" element={<AdminPosts />} />
                
                <Route path="/AdminROMs" element={<AdminROMs />} />
                
                <Route path="/AdminTournaments" element={<AdminTournaments />} />
                
                <Route path="/AdminGuides" element={<AdminGuides />} />
                
                <Route path="/AdminPokedex" element={<AdminPokedex />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}