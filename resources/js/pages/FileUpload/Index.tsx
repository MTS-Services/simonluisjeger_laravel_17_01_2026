import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { create, edit, show, destroy } from '@/actions/App/Http/Controllers/Frontend/FileUploadController';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Trash2, Edit2, Eye } from 'lucide-react';

interface FileUpload {
    id: number;
    path: string;
    mime_type: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    fileUploads: FileUpload[];
}

export default function Index({ fileUploads }: Props) {

    // Using Inertia router is cleaner than manual form creation
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this file?')) {
            router.delete(destroy.url(id), {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: add a toast notification here
                },
            });
        }
    };

    return (
        <>
            <Head title="File Uploads" />
            <AppLayout>
                <div className="container mx-auto py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">File Uploads</h1>
                        <Link href={create.url()}>
                            <Button>Upload New File</Button>
                        </Link>
                    </div>

                    {fileUploads.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">ID</TableHead>
                                        <TableHead>File Path</TableHead>
                                        <TableHead>MIME Type</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fileUploads.map((file) => (
                                        <TableRow key={file.id}>
                                            <TableCell className="font-medium">#{file.id}</TableCell>
                                            <TableCell className="truncate max-w-xs" title={file.path}>
                                                {file.path}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                                                    {file.mime_type}
                                                </span>
                                            </TableCell>
                                            <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Link href={show.url(file.id)}>
                                                        <Button size="sm" variant="ghost">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={edit.url(file.id)}>
                                                        <Button size="sm" variant="ghost">
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleDelete(file.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-12 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground mb-4">No files uploaded yet.</p>
                            <Link href={create.url()}>
                                <Button variant="outline">Upload Your First File</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}