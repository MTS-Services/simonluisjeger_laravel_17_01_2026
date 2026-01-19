import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
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
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this file?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/fileupload/${id}`;
            form.innerHTML = `
                <input type="hidden" name="_token" value="${document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}">
                <input type="hidden" name="_method" value="DELETE">
            `;
            document.body.appendChild(form);
            form.submit();
        }
    };

    return (
        <>
            <Head title="File Uploads" />
            <AppLayout>
                <div className="container mx-auto py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">File Uploads</h1>
                        <Link href="/fileupload/create">
                            <Button>Upload New File</Button>
                        </Link>
                    </div>

                    {fileUploads.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>File Path</TableHead>
                                        <TableHead>MIME Type</TableHead>
                                        <TableHead>Created At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fileUploads.map((file) => (
                                        <TableRow key={file.id}>
                                            <TableCell>{file.id}</TableCell>
                                            <TableCell className="truncate max-w-xs">{file.path}</TableCell>
                                            <TableCell>{file.mime_type}</TableCell>
                                            <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex gap-2 justify-end">
                                                    <Link href={`/fileupload/${file.id}`}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/fileupload/${file.id}/edit`}>
                                                        <Button size="sm" variant="outline">
                                                            <Edit2 className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
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
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No files uploaded yet.</p>
                            <Link href="/fileupload/create">
                                <Button>Upload Your First File</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </AppLayout>
        </>
    );
}
