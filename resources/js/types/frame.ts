export interface FrameElement {
    id: number;
    frame_id: number;
    name: string;
    overlay_image: string;
    overlay_image_url?: string | null;
    title: string | null;
    description: string | null;
    media_type: 'image' | 'video' | null;
    media_url: string | null;
    media_file_url?: string | null;
    x_pct: number;
    y_pct: number;
    w_pct: number;
    h_pct: number;
    z_index: number;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Frame {
    id: number;
    name: string;
    bg_image: string | null;
    bg_image_url?: string | null;
    base_svg: string | null;
    base_svg_url?: string | null;
    design_width: number;
    design_height: number;
    is_active: boolean;
    elements: FrameElement[];
    created_at: string;
    updated_at: string;
}

export interface ElementLayout {
    id: number;
    x_pct: number;
    y_pct: number;
    w_pct: number;
    h_pct: number;
    z_index: number;
}

/**
 * Example JSON payload for saving layout (bulk update):
 *
 * PUT /admin/frames/{id}/layout
 * {
 *   "elements": [
 *     { "id": 1, "x_pct": 12.5, "y_pct": 20.0, "w_pct": 8.333, "h_pct": 14.286, "z_index": 1 },
 *     { "id": 2, "x_pct": 45.0, "y_pct": 30.0, "w_pct": 15.0,  "h_pct": 20.0,   "z_index": 2 },
 *     { "id": 3, "x_pct": 70.0, "y_pct": 10.0, "w_pct": 10.0,  "h_pct": 12.0,   "z_index": 3 }
 *   ]
 * }
 *
 * Example JSON response for fetching frame:
 *
 * GET /admin/frame-editor (Inertia props)
 * {
 *   "frame": {
 *     "id": 1,
 *     "name": "Default Frame",
 *     "bg_image": "frames/backgrounds/bg.jpg",
 *     "base_svg": "frames/svgs/base.svg",
 *     "design_width": 1200,
 *     "design_height": 700,
 *     "is_active": true,
 *     "elements": [
 *       {
 *         "id": 1,
 *         "frame_id": 1,
 *         "name": "Logo",
 *         "overlay_image": "frames/elements/logo.png",
 *         "title": "Company Logo",
 *         "description": "Our main branding element",
 *         "media_type": "image",
 *         "media_url": "frames/media/logo-detail.jpg",
 *         "x_pct": 12.5,
 *         "y_pct": 20.0,
 *         "w_pct": 8.333,
 *         "h_pct": 14.286,
 *         "z_index": 1,
 *         "sort_order": 1
 *       }
 *     ]
 *   }
 * }
 *
 * Percent-based positioning:
 * - x_pct = (element_left_px / frame_design_width) * 100
 * - y_pct = (element_top_px  / frame_design_height) * 100
 * - w_pct = (element_width_px  / frame_design_width)  * 100
 * - h_pct = (element_height_px / frame_design_height) * 100
 *
 * When rendering on any screen size, the frame container scales responsively.
 * Element positions are calculated as:
 *   left = (x_pct / 100) * containerWidth
 *   top  = (y_pct / 100) * containerHeight
 *   width  = (w_pct / 100) * containerWidth
 *   height = (h_pct / 100) * containerHeight
 */
