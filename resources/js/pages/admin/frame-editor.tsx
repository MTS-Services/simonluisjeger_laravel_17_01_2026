import { Link, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Save, Settings } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FrameCanvas } from '@/components/frame/frame-canvas';
import { FramePreview } from '@/components/frame/frame-preview';
import { ElementListSidebar } from '@/components/frame/element-list-sidebar';
import { ElementFormDialog } from '@/components/frame/element-form-dialog';
import { ElementModal } from '@/components/frame/element-modal';
import { FrameSettingsDialog } from '@/components/frame/frame-settings-dialog';
import type { Frame, FrameElement, ElementLayout } from '@/types/frame';

interface Props {
    frame: Frame;
}

export default function FrameEditor({ frame }: Props) {
    const { props } = usePage();
    const flash = (props as Record<string, unknown>).flash as { message?: string } | undefined;

    const [editMode, setEditMode] = useState(false);
    const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
    const [modalElement, setModalElement] = useState<FrameElement | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingElement, setEditingElement] = useState<FrameElement | null>(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bgPreviewUrl, setBgPreviewUrl] = useState<string | null>(null);
    const [basePreviewUrl, setBasePreviewUrl] = useState<string | null>(null);

    const [layouts, setLayouts] = useState<ElementLayout[]>(() =>
        frame.elements.map((el) => ({
            id: el.id,
            x_pct: el.x_pct,
            y_pct: el.y_pct,
            w_pct: el.w_pct,
            h_pct: el.h_pct,
            z_index: el.z_index,
            rotation: el.rotation ?? 0,
        })),
    );

    useEffect(() => {
        setLayouts(
            frame.elements.map((el) => ({
                id: el.id,
                x_pct: el.x_pct,
                y_pct: el.y_pct,
                w_pct: el.w_pct,
                h_pct: el.h_pct,
                z_index: el.z_index,
                rotation: el.rotation ?? 0,
            })),
        );
        setBgPreviewUrl(null);
        setBasePreviewUrl(null);
    }, [frame.elements, frame.bg_image_url, frame.base_svg_url]);

    useEffect(() => {
        return () => {
            if (bgPreviewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(bgPreviewUrl);
            }
        };
    }, [bgPreviewUrl]);

    useEffect(() => {
        return () => {
            if (basePreviewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(basePreviewUrl);
            }
        };
    }, [basePreviewUrl]);

    const hasChanges = useCallback(() => {
        return frame.elements.some((el) => {
            const layout = layouts.find((l) => l.id === el.id);
            if (!layout) return false;
            return (
                Math.abs(el.x_pct - layout.x_pct) > 0.001 ||
                Math.abs(el.y_pct - layout.y_pct) > 0.001 ||
                Math.abs(el.w_pct - layout.w_pct) > 0.001 ||
                Math.abs(el.h_pct - layout.h_pct) > 0.001 ||
                el.z_index !== layout.z_index ||
                Math.abs((el.rotation ?? 0) - (layout.rotation ?? 0)) > 0.001
            );
        });
    }, [frame.elements, layouts]);

    function handleSaveLayout() {
        setSaving(true);
        router.put(
            `/admin/frames/${frame.id}/layout`,
            {
                elements: layouts.map((l) => ({
                    id: l.id,
                    x_pct: parseFloat(l.x_pct.toFixed(4)),
                    y_pct: parseFloat(l.y_pct.toFixed(4)),
                    w_pct: parseFloat(l.w_pct.toFixed(4)),
                    h_pct: parseFloat(l.h_pct.toFixed(4)),
                    z_index: l.z_index,
                    rotation: parseFloat((l.rotation ?? 0).toFixed(2)),
                })),
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    }

    function handleElementClick(element: FrameElement) {
        if (!editMode) {
            setModalElement(element);
            setShowModal(true);
        }
    }

    function handleEditElement(element: FrameElement) {
        setEditingElement(element);
        setShowEditForm(true);
    }

    return (
        <AdminLayout activeSlug="frame-editor">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Frame Editor</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage overlay elements on the SVG frame
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {flash?.message && (
                        <Badge variant="secondary" className="mr-2">
                            {flash.message}
                        </Badge>
                    )}
                    <Button variant="outline" size="sm" asChild>
                        <Link href={route('admin.frame.preview')} target="_blank">
                            <Eye className="mr-1 size-3.5" /> Preview
                        </Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                        <Settings className="mr-1 size-3.5" />
                        Settings
                    </Button>
                    <Button
                        variant={editMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setEditMode(!editMode)}
                    >
                        {editMode ? (
                            <>
                                <Eye className="mr-1 size-3.5" />
                                View Mode
                            </>
                        ) : (
                            <>
                                <Pencil className="mr-1 size-3.5" />
                                Edit Mode
                            </>
                        )}
                    </Button>
                    {editMode && hasChanges() && (
                        <Button size="sm" onClick={handleSaveLayout} disabled={saving}>
                            <Save className="mr-1 size-3.5" />
                            {saving ? 'Saving...' : 'Save Layout'}
                        </Button>
                    )}
                </div>
            </div>

            <div className="mt-6 space-y-6">
                {/* <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between pb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Live Preview</h2>
                            <p className="text-sm text-muted-foreground">Rendered exactly as the public frontend frame.</p>
                        </div>
                        {!editMode && (
                            <Badge variant="outline" className="text-xs">
                                View Mode
                            </Badge>
                        )}
                    </div>
                    <FramePreview
                        frame={frame}
                        layouts={layouts}
                        onElementClick={handleElementClick}
                        bgPreviewUrl={bgPreviewUrl}
                        basePreviewUrl={basePreviewUrl}
                        className="mx-auto"
                    />
                </div>
                */}
                <div className="flex gap-0  overflow-hidden rounded-lg border bg-background min-h-[calc(100vh-200px)]">
                    {/* Left sidebar: element list */}
                    <div className="w-84 shrink-0">
                        <ElementListSidebar
                            frame={frame}
                            selectedElementId={selectedElementId}
                            onSelectElement={setSelectedElementId}
                            onAddElement={() => setShowAddForm(true)}
                            onEditElement={handleEditElement}
                            editMode={editMode}
                            layouts={layouts}
                            onLayoutChange={setLayouts}
                        />
                    </div>

                    {/* Right side: frame canvas */}
                    <div className="flex-1 overflow-auto p-4">
                        <FrameCanvas
                            frame={frame}
                            editMode={editMode}
                            selectedElementId={selectedElementId}
                            onSelectElement={setSelectedElementId}
                            onElementClick={handleElementClick}
                            onLayoutChange={setLayouts}
                            layouts={layouts}
                        />
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <ElementFormDialog
                frame={frame}
                open={showAddForm}
                onOpenChange={setShowAddForm}
            />
            <ElementFormDialog
                frame={frame}
                element={editingElement}
                open={showEditForm}
                onOpenChange={(open) => {
                    setShowEditForm(open);
                    if (!open) setEditingElement(null);
                }}
            />
            <ElementModal
                element={modalElement}
                open={showModal}
                onOpenChange={setShowModal}
            />
            <FrameSettingsDialog
                frame={frame}
                open={showSettings}
                onOpenChange={setShowSettings}
                onBackgroundPreviewChange={setBgPreviewUrl}
                onSaved={() => router.reload({ only: ['frame'] })}
            />
        </AdminLayout>
    );
}
