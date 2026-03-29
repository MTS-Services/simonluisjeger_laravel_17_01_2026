import AdminLayout from '@/layouts/admin-layout';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import CustomToast, { ToastType } from '@/components/ui/custom-toast';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import BackgroundTextRenderer from '@/components/background-text-renderer';
import type { Frame } from '@/types/frame';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const NONE_ELEMENT = '__none__';

function parseLinkFrameElementId(raw: unknown): number | null {
    if (raw == null || raw === '') {
        return null;
    }
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || n <= 0) {
        return null;
    }
    return Math.trunc(n);
}

/** Full form shape synced from `information` (server). */
function buildFormStateFromInformation(info: Record<string, unknown>) {
    return {
        text1: String(info.text1 ?? ''),
        text2: String(info.text2 ?? ''),
        background_color: String(info.background_color || '#d9d9d9'),
        text_color: String(info.text_color || '#e6e6e6'),
        text1_link_element_name: String(info.text1_link_element_name ?? ''),
        text1_link_frame_element_id: parseLinkFrameElementId(info.text1_link_frame_element_id),
        text1_link_color: String(info.text1_link_color || '#2563eb'),
        text1_link_underline:
            info.text1_link_underline === undefined || info.text1_link_underline === null
                ? true
                : Boolean(info.text1_link_underline),
    };
}

export default function BackgroundText({
    information,
    frame,
    projectPreview = [],
}: {
    information: Record<string, unknown> | null;
    frame: Frame | null;
    projectPreview?: { key: string; title: string }[];
}) {
    const { errors, flash } = usePage<any>().props;
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const { data, setData, setDefaults, post, processing, transform } = useForm({
        text1: '',
        text2: '',
        background_color: '#d9d9d9',
        text_color: '#e6e6e6',
        text1_link_element_name: '',
        text1_link_frame_element_id: null as number | null,
        text1_link_color: '#2563eb',
        text1_link_underline: true,
    });

    transform((form) => {
        const raw = form.text1_link_frame_element_id as unknown;
        if (raw === undefined || raw === null || raw === '') {
            return { ...form, text1_link_frame_element_id: null };
        }
        const n = Number(raw);
        return {
            ...form,
            text1_link_frame_element_id: Number.isFinite(n) && n > 0 ? n : null,
        };
    });

    const sortedFrameElements = useMemo(
        () =>
            [...(frame?.elements ?? [])].sort(
                (a, b) =>
                    (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name)
            ),
        [frame?.elements]
    );

    const serverFormFingerprint = useMemo(
        () =>
            information == null
                ? ''
                : JSON.stringify({
                    id: information.id,
                    updated_at: information.updated_at,
                    text1: information.text1,
                    text2: information.text2,
                    background_color: information.background_color,
                    text_color: information.text_color,
                    text1_link_element_name: information.text1_link_element_name,
                    text1_link_frame_element_id: information.text1_link_frame_element_id,
                    text1_link_color: information.text1_link_color,
                    text1_link_underline: information.text1_link_underline,
                }),
        [information]
    );

    useEffect(() => {
        if (flash?.message) setToast({ message: flash.message, type: 'success' });
        if (flash?.error) setToast({ message: flash.error, type: 'error' });
    }, [flash]);

    useLayoutEffect(() => {
        if (!information) {
            return;
        }
        const next = buildFormStateFromInformation(information);
        setDefaults(next);
        setData(next);
        // Only re-apply when serialized server data changes — not when `information` is a new object reference with the same payload (avoids wiping the form on unrelated re-renders).
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: sync keyed by serverFormFingerprint only
    }, [serverFormFingerprint]);

    const savedLinkElementId = parseLinkFrameElementId(data.text1_link_frame_element_id);

    const orphanSavedElement =
        savedLinkElementId != null &&
            !sortedFrameElements.some((el) => el.id === savedLinkElementId)
            ? savedLinkElementId
            : null;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.background_text.update'), {
            preserveScroll: true,
            onSuccess: (page) => {
                // Inertia useForm after onSuccess clones current `data` into `defaults`. That can freeze stale
                // values and fight Radix Select. Calling setDefaults here skips that and locks form to server props.
                const info = page.props.information as Record<string, unknown> | null | undefined;
                if (info) {
                    const next = buildFormStateFromInformation(info);
                    setDefaults(next);
                    setData(next);
                }
                setToast({ message: 'Updated successfully!', type: 'success' });
            },
            onError: () => {
                setToast({ message: 'Error updating project.', type: 'error' });
            },
        });
    };

    return (
        <AdminLayout activeSlug="background_text">
            <Head title="Background Text" />
            {toast && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            <section className="max-w-6xl mx-auto px-4 py-6">
                <form onSubmit={submit} className="bg-white p-8 rounded-xl border shadow-sm space-y-8">
                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-2xl font-bold capitalize">Background Text</h2>
                        <Button type="submit" disabled={processing} className="cursor-pointer capitalize">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Saving...' : 'Save Background Texts'}
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2 space-y-2">
                                    <Label>Text 1 internal link — canvas element</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Pick the hotspot whose video and info panel should open when visitors click the linked
                                        phrase in Text&nbsp;1 (same behavior as clicking that element on the frame).
                                    </p>
                                    {sortedFrameElements.length > 0 || orphanSavedElement != null ? (
                                        <Select
                                            key={`text1-link-${savedLinkElementId ?? NONE_ELEMENT}`}
                                            value={
                                                savedLinkElementId != null
                                                    ? String(savedLinkElementId)
                                                    : NONE_ELEMENT
                                            }
                                            onValueChange={(v) => {
                                                if (v === NONE_ELEMENT) {
                                                    setData('text1_link_frame_element_id', null);
                                                } else {
                                                    setData('text1_link_frame_element_id', Number(v));
                                                    setData('text1_link_element_name', '');
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-full max-w-xl">
                                                <SelectValue placeholder="None — external link only (see field below)" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={NONE_ELEMENT}>None</SelectItem>
                                                {orphanSavedElement != null && (
                                                    <SelectItem value={String(orphanSavedElement)}>
                                                        Element #{orphanSavedElement} (not on active frame — choose
                                                        another or save to clear)
                                                    </SelectItem>
                                                )}
                                                {sortedFrameElements.map((el) => (
                                                    <SelectItem key={el.id} value={String(el.id)}>
                                                        {el.name}
                                                        {el.title ? ` — ${el.title}` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Activate a frame with elements in the frame editor to use this list, or use the field
                                            below to type an element name, title, or project key.
                                        </p>
                                    )}
                                    <InputError message={errors.text1_link_frame_element_id} />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label>External link (optional)</Label>
                                    <Input
                                        value={data.text1_link_element_name}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setData('text1_link_element_name', v);
                                            const t = v.trim();
                                            if (
                                                t.startsWith('http://') ||
                                                t.startsWith('https://') ||
                                                t.startsWith('mailto:')
                                            ) {
                                                setData('text1_link_frame_element_id', null);
                                            }
                                        }}
                                        placeholder="https://… or mailto:…"
                                        className="mt-1"
                                    />
                                    <InputError message={errors.text1_link_element_name} />
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        For an <strong>external</strong> link, add the full URL or{' '}
                                        <code className="rounded bg-muted px-1">mailto:…</code> here. For an{' '}
                                        <strong>internal</strong> canvas link, use the dropdown above and{' '}
                                        <strong>leave this empty</strong>. (Advanced: you may still type an element name, title,
                                        or project key here if you are not using the dropdown.) Wrap the linked words in
                                        Text&nbsp;1 with <code className="rounded bg-muted px-1">&lt;a&gt;…&lt;/a&gt;</code>.
                                    </p>
                                </div>
                                <div>
                                    <Label>Link color</Label>
                                    <div className="mt-1 flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={data.text1_link_color?.startsWith('#') ? data.text1_link_color : '#2563eb'}
                                            onChange={(e) => setData('text1_link_color', e.target.value)}
                                            className="h-10 w-14 cursor-pointer rounded border p-1"
                                        />
                                        <Input
                                            value={data.text1_link_color}
                                            onChange={(e) => setData('text1_link_color', e.target.value)}
                                            maxLength={7}
                                            className="w-28 font-mono"
                                            placeholder="#2563eb"
                                        />
                                    </div>
                                    <InputError message={errors.text1_link_color} />
                                </div>
                                <div className="flex items-end gap-3 pb-2">
                                    <Checkbox
                                        id="text1_link_underline"
                                        checked={data.text1_link_underline}
                                        onCheckedChange={(checked) => setData('text1_link_underline', checked === true)}
                                    />
                                    <Label htmlFor="text1_link_underline" className="cursor-pointer font-normal leading-none">
                                        Underline link text
                                    </Label>
                                </div>
                            </div>
                            <div>
                                <Label>Text 1</Label>
                                <Textarea
                                    rows={4}
                                    value={data.text1}
                                    onChange={(e) => setData('text1', e.target.value)}
                                    placeholder='e.g. Hello <a>world</a>.'
                                />
                                <InputError message={errors.text1} />
                                <div className="mt-3 rounded-lg border bg-gray-50 p-4">
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Live preview</p>
                                    <BackgroundTextRenderer
                                        text={data.text1}
                                        linkTarget={data.text1_link_element_name}
                                        linkFrameElementId={savedLinkElementId}
                                        linkColor={data.text1_link_color}
                                        linkUnderline={data.text1_link_underline}
                                        frameElements={frame?.elements}
                                        projects={projectPreview}
                                        previewMode
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Text 2</Label>
                                <Textarea rows={4} value={data.text2} onChange={(e) => setData('text2', e.target.value)} />
                                <InputError message={errors.text2} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label>Background Color</Label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <input
                                            type="color"
                                            value={data.background_color}
                                            onChange={(e) => setData('background_color', e.target.value)}
                                            className="h-10 w-14 cursor-pointer rounded border p-1"
                                        />
                                        <Input
                                            value={data.background_color}
                                            onChange={(e) => setData('background_color', e.target.value)}
                                            maxLength={7}
                                            className="w-28 font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.background_color} />
                                </div>
                                <div>
                                    <Label>Text Font Color</Label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <input
                                            type="color"
                                            value={data.text_color}
                                            onChange={(e) => setData('text_color', e.target.value)}
                                            className="h-10 w-14 cursor-pointer rounded border p-1"
                                        />
                                        <Input
                                            value={data.text_color}
                                            onChange={(e) => setData('text_color', e.target.value)}
                                            maxLength={7}
                                            className="w-28 font-mono"
                                        />
                                    </div>
                                    <InputError message={errors.text_color} />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </AdminLayout>
    );
}
