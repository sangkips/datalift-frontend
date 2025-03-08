"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { FileText, Tag, Wrench, HelpCircle } from "lucide-react"

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState("documents")

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <h1 className="text-xl font-bold">datalift.ai</h1>
      </div>

      {/* Workspace Selector */}
      <div className="sidebar-workspace">
        <div className="flex items-center">
          <div>
            <div className="text-sm">Personal 1</div>
            <div className="text-xs opacity-70">Switch Workspace</div>
          </div>
        </div>
        <ChevronDown className="opacity-70" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div
          className={`sidebar-item ${activeItem === "documents" ? "active" : ""}`}
          onClick={() => setActiveItem("documents")}
        >
          <FileText className="sidebar-item-icon" size={20} />
          <span>Documents</span>
        </div>
        <div
          className={`sidebar-item ${activeItem === "labels" ? "active" : ""}`}
          onClick={() => setActiveItem("labels")}
        >
          <Tag className="sidebar-item-icon" size={20} />
          <span>Labels</span>
        </div>
        <div className={`sidebar-item ${activeItem === "api" ? "active" : ""}`} onClick={() => setActiveItem("api")}>
          <Wrench className="sidebar-item-icon" size={20} />
          <span>API</span>
        </div>
        <div
          className={`sidebar-item ${activeItem === "support" ? "active" : ""}`}
          onClick={() => setActiveItem("support")}
        >
          <HelpCircle className="sidebar-item-icon" size={20} />
          <span>Support</span>
        </div>
      </nav>

      {/* User Profile */}
      <div className="sidebar-footer">
        <div className="user-avatar">K</div>
        <div className="user-info">
          <div className="user-name">Kipkoech Sang</div>
          <div className="user-credits">
            <span className="credit-dot"></span>
            20 credits
          </div>
        </div>
        <ChevronDown className="opacity-70 cursor-pointer" />
      </div>
    </div>
  )
}

