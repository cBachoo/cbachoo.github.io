#include <stdio.h>
#include <stdarg.h>

void c(char *buf, ...)
{
	va_list args;
	va_start (args, buf);     /* Initialize the argument args. */

	char arg = va_arg(args, int);
	
	while( arg ) {
		sprintf(buf, "%s%c", buf, arg);
		arg = va_arg(args, int);
	}

	va_end (args);                  /* Clean up. */
}


void secretFunction(int argc, char const *argv[])
{
	printf("Congratulations! \nYou've found the secret function!\n\n");
	char * code[8];
	c(code, 'b', 'G', 'l', 's', 'e', 'Q', '=', '=');
	printf("DM me this code:\n");
	printf("'%.*s'\n", 20, code);
}

void echo()
{
	char buffer[20];
	
	printf("I hold no secrets.\n");
	scanf("%s", buffer);
	printf("%s\n", buffer);
}

int main()
{
	echo();
	
	return 0;
}